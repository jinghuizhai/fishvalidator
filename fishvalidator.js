function FishValidator(data,rule){
    var that = this
    data = data || []
    rule = rule || {}

    var tips = {
        require:'%s为必填项',
        min:'%s字符长度不能小于%s',
        max:'%s字符长度不能大于%s',
        size:'%s字符长度必须在%s~%s之间',
        gt:'%s必须大于%s',
        egt:'%s必须大于等于%s',
        lt:'%s必须小于%s',
        elt:'%s必须小于等于%s',
        range:'%s必须在%s~%s之间',
        integer:'%s必须一个整数',
        number:'%s必须一个数字',
        include:'%s必须在%s之内',
        phone:'手机号格式不符合要求',
        email:'邮箱格式不符合要求',
        reg:'%s不符合要求',
        zip:'邮编格式不符合要求',
        id:'身份证格式不符合要求'
    }
    this.getValue = function(key){
        return data[key] ? data[key] : '';
    }
    this.ast = function(rule) {
        for(var r in rule){
            var value = rule[r].toString().trim()
            //分离每个规则为多个rule
            var values = value.split('|')
            for(var i = 0,len = values.length;i < len;i++){
                //分开min:1为min和[1]
                var items = values[i].split(':')
                if(items.length > 0){
                    var keys = r.split('|')
                    var key = {
                        name:keys[0],
                        alias:keys[1] || keys[0]
                    }
                    var method = items[0]
                    var args = items[1] ? items[1]:undefined
                    if(args && args.indexOf(',') > -1){
                        args = args.split(',')
                    }else{
                        args = [args]
                    }
                    that.invoke(key,method,args)
                }
            }
        }
    }
    this.check = function(){
        try{
            that.ast(rule)
        }catch(e){
            that.errorMsg = e
            return false
        }
        return true
    }
    this.getError = function(){
        return this.errorMsg
    }
    this.exception = function(str){
        throw str
    }
    this.toNumber = function(str){
        var number = new Number(str)
        if(isNaN(number)){
            this.exception(str + '必须是一个数字')
        }else{
            return number
        }
    }
    this.format = function(tipKey,key,args){
        args = args || []
        args.unshift(key.alias)
        return this.formatString(tips[tipKey],args)
    }
    this.formatString = function(str,args){
        for(var i = 0,len = args.length;i < len;i++){
            str = str.replace('%s',args[i])
        }
        return str
    }
    this.invoke = function(key,method,args){
        if(this[method]){
            this[method](key,args)
        }else{
            throw '方法'+method+'不存在'
        }
    }
    this.require = function(key){
        if( ! this.getValue(key.name)){
            this.exception(that.format('require',key))
        }
    }
    this.min = function(key,args){
        var value = this.getValue(key.name)
        if(value.length < args[0]){
            this.exception(that.format('min',key,args))
        }
    }
    this.max = function(key,args){
        var value = this.getValue(key.name)
        if(value.length > args[0]){
            this.exception(that.format('max',key,args))
        }
    }
    this.size = function(key,args){
        var value = this.getValue(key.name)
        if(args.length == 2){
            if(value.length < args[0] || value.length > args[1]){
                this.exception(that.format('size',key,args))
            }
        }else if(args.length == 1){
            if(value.length != args[0]){
                this.exception(key.alias+'长度必须为'+args[0])
            }
        }else{
            this.exception('Wrong arguments')
        }
    }
    this.gt = function(key,args){
        var value = this.getValue(key.name)
        var number = this.toNumber(value)
        if(number <= args[0]){
            this.exception(that.format('gt',key,args))
        }
    }
    this.egt = function(key,args){
        var value = this.getValue(key.name)
        var number = this.toNumber(value)
        if(number < args[0]){
            this.exception(that.format('egt',key,args))
        }
    }
    this.lt = function(key,args){
        var value = this.getValue(key.name)
        var number = this.toNumber(value)
        if(number >= args[0]){
            this.exception(that.format('lt',key,args))
        }
    }
    this.elt = function(key,args){
        var value = this.getValue(key.name)
        var number = this.toNumber(value)
        if(number > args[0]){
            this.exception(that.format('elt',key,args))
        }
    }
    this.range = function(key,args){
        var value = this.getValue(key.name)
        var left = this.toNumber(args[0])
        var right = this.toNumber(args[1])
        if(value < left || value > right){
            this.exception(that.format('range',key,args))
        }
    }
    this.integer = function(key){
        var value = this.getValue(key.name)
        value = this.toNumber(value)
        if(value * 10 / 10 != value){
            this.exception('integer',key)
        }
    }
    this.number = function(key){
        var value = this.getValue(key.name)
        if(isNaN(new Number(value))){
            this.exception(this.format('number',key))
        }
    }
    this.include = function(key,args){
        var value = this.getValue(key.name)
        var inside = false
        for(var i = 0,len = args.length;i < len;i++){
            if(args[i] == value){
                inside = true
            }
        }
        if( ! inside){
            this.exception(that.format('include',key,[args.toString()]))
        }
    }
    this.reg = function(key,args){
        var value = this.getValue(key.name)
        var reg = new RegExp(args[0])
        if( ! reg.test(value)){
            this.exception(that.format('reg',key))
        }
    }
    this.phone = function(key){
        var value = this.getValue(key.name)
        if( ! /^1[3578]\d{9}$/.test(value)){
            this.exception(that.format('phone',key))
        }
    }
    this.email = function(key){
        var value = this.getValue(key.name)
        if( ! /[\da-z_-]{3,30}@[\da-z]{2,6}\.[a-z]{2,5}$/i.test(value)){
            this.exception(that.format('email',key))
        }
    }
    this.zip = function(key){
        var value = this.getValue(key.name)
        if( ! /^[1-9]\d{5}$/.test(value)){
            this.exception(that.format('zip',key))
        }
    }
    this.id = function(key){
        var value = this.getValue(key.name)
        if( ! /^[1-9]\d{5}[1-2]\d{3}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|[3][0-1])\d{4}x?$/.test(value)){
            this.exception(that.format('id',key))
        }
    }
}
