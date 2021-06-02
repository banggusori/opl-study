//import 'jquery.fancytree/dist/skin-lion/ui.fancytree.less'


function fancyTree(){    
    "use strict";        
    var _root = this;
    var _version = "1.0";
    var _module,_extension;
    var _div;
    var _modeChk = false;
    var _dndFlag = true;
    var _register = [];
    var _dataObj = {}, _dataTree ={};
    var _options = {group:{upCode:"upCode",code:"code"}}
    var _drop = undefined;
    var _newCode = 0;
    var _cookie = new _cookies;
    var _cookieKey = 'treeCookies';
    var _copyMode = false;
    const update = function(node){
        let param = node;
        let d = _register[param.code];
        if(d == undefined){
            param['flag'] = 'U';
            _register[param.code] = param;
        }else{
            _register[param.code] = Object.assign(d,param);    
        }
    }

    const changedUpcode = function(key,code){
        if(_register[key]){
            _register[key][_options.group.upCode] = code;
        }
    }
    const del = function(node){
        let param = node;
        let d = _dataObj[param.code];
        if(d){
        if(d.flag == 'U'){
            d['flag'] = 'D';
        }else{
            delete _dataObj[d.code] ;
            this.deleteNewD(param.code);
        }
        }else{
            param['flag'] = 'D';
            _dataObj[param.code] = param;
            //this.deleteNewD(param.code);
        }
    }
    const insert = function(node){
        let param = node;
        let d = _dataObj[param.code];
        if(!d){
            param['flag'] = 'I';
            _dataObj[param.code] = param;
            _register[param.code] = param;
        }else{
            update(param);
        }
    }
    const deleteNewD = function(code){
        for(var i=0; i <_register.length; i ++){
            if(newD.code == code){
            _register.splice(i,1);
            }
        }
    }

    const arrayToObj = function(d,key){
        var obj = {};
        for(var i =0 ; i <d.length; i ++){
            obj[d[i][key]] = d[i];
        }
        return obj;
    }
    const objToTree = function(arr, parent,id,parentId,childName){
        var out = []
        for (var i in arr) {
            if (arr[i][parentId] == parent) {
            var children = objToTree(arr, arr[i][id],id,parentId,childName)
            
            if (children.length) {
                arr[i][childName] = children
            }
            out.push(arr[i])
            }
        }
        return out
    }

    
    if(typeof exports !=='undefined'){
        _module = exports;
    }else{
        _module = _root._module = {};
    }
    _module.getVersion = function(){
        return _version;
    }

    _module.getChangeData = function(){
        return _register;
    }
    _module.init = function(div,extension,d=[],options={group:{upCode:"up_code",code:"code"}}){
        _div = div;
        _extension = extension;


        var openList = _cookie.getCookie(_cookieKey);
        d=d.map((obj)=>{
            for(var i =0; i <openList.length; i ++){
                if(obj[_options.group.code] == openList[i]){
                    obj["expanded"]=true;
                }
            }
            return obj;
        })

        _options = Object.assign(_options,options);
        _dataObj = arrayToObj(d,options.group.code);
        _dataTree = objToTree(d, 0,_options.group.code,_options.group.upCode,"children");
        
        if(this.errChk()){
            return;
        }
        var fncy = $(_div).fancytree({
            extensions:_extension,
            source:_dataTree,
            beforeExpand:function(event,data){
                var expand = data.node.isExpanded();
                var cookie = JSON.parse(_cookie.getCookie(_cookieKey));
                var code =data.node.data[_options.group.code];
                if(!expand){
                    console.log(cookie);
                    cookie.push(code);
                    _cookie.setCookie(_cookieKey,cookie);
                }else{
                    if(cookie.length>0){
                        var index = cookie.indexOf(code);
                        if(index !== -1){
                            cookie.splice(index,1);
                            _cookie.setCookie(_cookieKey,cookie);
                        }
                    }
                }
            },
            dnd5:{
                preventVoidMoves: true,
                preventRecursion:true,
                preventSameParent:false,
                autoExpandMS:1000,
                multiSource:true,
                dragStart: function(node,data){
                    data.effectAllow = "all";
                    data.dropEffect = data.dropEffectSuggested;
                    return _dndFlag;
                },
                dragEnter:function(node,data){
                   // data.node.info("dragEnter",data);
                    return _dndFlag;
                },
                dragOver:function(node,data){
                    data.dropEffect = data.dropEffectSuggested;
                    return _dndFlag;
                },
                dragDrop:function(node,data){
                    var sourceNodes = data.otherNodeList,copyMode = data.dropEffect !=="move";
                    if(data.hitMode ==="after"){
                        sourceNodes.reverse();
                    }
                    if(_copyMode){
                        $.each(sourceNodes, function(i, o){
                            //o.info("copy to " + node + ": " + data.hitMode);
                            var newNode =o.copyTo(node, data.hitMode, function(n){
                                delete n.key;
                                n.selected = false;
                                n.title = n.title;
                                var code = newCode();
                                n.data[_options.group.code] = code;
                            });
                            newNode.data[_options.group.upCode] = newNode.parent.data[_options.group.code];
                            insert(newNode.data);
                        });
                    }else{
                        $.each(sourceNodes, function(i, o){
                            o.moveTo(node, data.hitMode);
                        });
                    }
                    //node.debug("drop",data);
                    node.setExpanded();
                },
                dragEnd:function(node,data){
                    var sourceNodes = data.otherNodeList,copyMode = data.dropEffect !=="move";
                    if(data.hitMode ==="after"){
                        sourceNodes.reverse();
                    }
                    $.each(sourceNodes,function(i,o){
                        let pCode = o.parent.data.code 
                        pCode = pCode == null && pCode ==undefined ? 0 : pCode;
                        let oData = o.data;
                        oData[_options.group.upCode] = pCode;
                        insert(oData);
                    })
                    if(_drop){
                        _drop(node,data,sourceNodes);
                    }
                }
            },
            edit:{
                triggerStart:["f2"],
                beforeClose:function(event,data){
                    if(data.save && data.isNew){
                        console.log(event,data);
                    }
                },
                save:function(event,data){
                    setTimeout(function(){
                        var d = data.node.data;
                        d['title'] = data.node.title;
                        insert(d);
                    },10);
                    return true;
                },
                beforeEdit:function(event,data){
                    if(data.node.folder){
                        return true;
                    }else{
                        return false;
                    }
                }
            }
        })
        return fncy;
    }
    _module.copyModeToggle = function(){
        _copyMode = _copyMode ? false : true;
        return _copyMode;
    }
    var newCode = function(){
        _newCode++;
        return "N"+_newCode;
    }
    _module.newItem = function(){
        var obj = {};
        obj[_options.group.code] = newCode();
        obj['title'] = "New Group";
        obj['folder'] = true;
        var tree = $.ui.fancytree.getTree(_div);
        var node = tree.getActiveNode();
        node.appendSibling(obj);
        insert(obj);
        return obj;
    }
    _module.disableDnd = function(){
        _dndFlag = false;
    }
    _module.enableDnd = function(){
        _dndFlag = true;
    }
    _module.toggle = function(){
        _modeChk = _modeChk ? false : true;
    }
    _module.getMode = function(){
        return _modeChk;
    }
    _module.drop = function(fn){
        _drop = fn;
    }
    _module.errChk = function(){
        if(!_div){
            console.error("please target div id // ex) #tree");
            return true;
        }
        if(!_extension){
            console.error("please tree add option ex) [\"dnd\",\"multi\"]");
            return true;
        }
    }
    _module.help = function(obj){
        console.log("Drag & Drop List [dragEnter,dragOver,dragEnd,dragDrop]");
    }
    return _module;
};