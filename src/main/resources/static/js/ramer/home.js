$( function() {
    var csrf = $( "#_csrf" ).val();
    // 实时动态
    if ($( ".user_panel" ).is( ":visible" )) {
        var topicUrl = "/user/realTimeTopic";
        var notifyUrl = "/user/realTimeNotify";
        var realTimeContent = setInterval( function() {
            $.get( topicUrl , {
                "_csrf" : csrf
            } , function( newTopicCount ) {
                console.log( "新动态：" + ~~newTopicCount );
                if (~~newTopicCount > 0)
                    // 新动态标识
                    $( "#newTopic" ).addClass( "newTopic" );

            } );
            $.get( notifyUrl , {
                "_csrf" : csrf
            } , function( newNotifyCount ) {
                console.log( "新通知：" + newNotifyCount );
                if (~~newNotifyCount > 0) {
                    // 新通知
                    $( "#newNotify" ).addClass( "newTopic" );
                }
            } );
        } , 600 * 1000 );
    }
    // 获取地理位置
    if (navigator.geolocation) {
        navigator.geolocation
                .watchPosition( function( position ) {
                    var latlon = position.coords.latitude + ',' + position.coords.longitude;
                    // baidu
                    var url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location="
                            + latlon + "&output=json&pois=0";
                    $.ajax( {
                        type : "GET",
                        dataType : "jsonp",
                        url : url,
                        success : function( json ) {
                            if (json.status == 0) {
                                $( "#positionVal" ).val( json.result.addressComponent.city );
                            }
                        },
                        error : function( XMLHttpRequest , textStatus , errorThrown ) {
                            $( "#positionVal" ).val( "位置获取失败" );
                        }
                    } );
                } );
    } else {
        alert( "浏览器不支持位置信息获取" );
    }

    // 从xml文件获取标签列表
    var optionTag = document.getElementById( "optionTag" );
    /* 指定标签信息的xml文件,全局变量 */
    requestUrl = "/xml/tags.xml";
    $.get( requestUrl , function( xml ) {
        var tag = $( xml ).find( "tag" );
        tag.each( function( index , content ) {
            optionTag += "<option value='" + $( content ).attr( 'name' ) + "'>" + $( content ).attr( 'name' )
                    + "</option>";
        } )
        $( "#tags" ).append( optionTag );
    } );
    // 将下拉标签的值，显示到输入框
    $( "#tags" ).change( function() {
        var tags = $( ".input_tags" ).val();
        var tag = $( this ).val();
        if (tag == "no") {
            return;
        }
        if ($.trim( tags ) == "") {
            $( ".input_tags" ).val( tag );
            return;
        } else if (tags.indexOf( tag ) >= 0) {
            return;
        } else
            $( ".input_tags" ).val( tags + ";" + tag );
    } )

    // 添加用户当前位置
    $( "#addPosition" ).click( function() {
        // 保存用户输入
        var text = $( ".topic_content" ).val();
        $( ".topic_content" ).val( text + "  " + $( "#positionVal" ).val() );
    } );

    // 添加当前时间
    $( "#addTime" ).click(
            function() {
                var text = $( ".topic_content" ).val();
                $( ".topic_content" ).val(
                        text + "  " + new Date().getFullYear() + "." + (new Date().getMonth() + 1) + "."
                                + new Date().getDate() );

            } );

    // 由于路径中含有中文时的问题，使用form提交标签
    $( ".tag" ).click( function() {
        var url = $( this ).attr( "href" );
        var tag = url.substring( url.lastIndexOf( "/" ) + 1 );
        console.log( "----->" + tag );
        $( "#tagName" ).attr( "value" , encodeURI( tag ) );
        $( "#tagForm" ).submit();
        return false;
    } );

    // 发布topic,验证用户标签是否符合格式
    $( "#submitTopic" ).click( function() {
        var tags = $( ".input_tags" ).val();
        if (tags.indexOf( "；" ) >= 0 || tags.indexOf( "，" ) >= 0 || tags.indexOf( "," ) >= 0) {
            layer.msg( "请使用英文;分隔标签" ) , {
                time : 1500,
            }
            return false;
        }
    } );

    // 通过标签查询分享,搜索框
    $( ".querytopic" ).change( function() {
        var tag = $( this ).val();
        $( "#tagName" ).attr( "value" , encodeURI( tag ) );
        $( "#tagForm" ).submit();
        return false;
    } );

    // 通过标签查询分享，分享标签
    $( ".tags" ).click( function() {
        var tag = $( this ).text();
        $( "#tagName" ).attr( "value" , encodeURI( tag ) );
        $( "#tagForm" ).submit();
        return false;
    } );

    // 上一页
    $( "#lastPage" ).click( function() {
        var number = new Number( $( "#number" ).val() ) + 1 - 1;
        if (number < 1) {
            layer.msg( "报告主人,上一页已结婚	(^v^)" , {
                time : 0
            } );
            return false;
        }
        Cookies.set( "scrollCookie_home" , "1" );
        console.log( "浏览器地址 ： " + location );
        // 如果是标签分页，需要带标签参数
        if (location.toString().indexOf( "tag=" ) > 0) {
            var url = location.toString();
            var tag = url.substring( location.toString().indexOf( "tag=" ) );
            console.log( "标签 ： " + tag );
            $( this ).attr( "href" , $( this ).attr( "href" ) + "&" + tag );
        }
    } );
    // 下一页
    $( "#nextPage" ).click( function() {
        var totalPages = $( "#totalPages" ).val();
        var number = new Number( $( "#number" ).val() ) + 2;
        Cookies.set( "scrollCookie_home" , "1" );
        if (number > totalPages) {
            layer.msg( "报告主人,下一页已结婚	(^v^)" , {
                time : 1800
            } );
            return false;
        }
        // 如果是标签分页，需要带标签参数
        if (location.toString().indexOf( "tag=" ) > 0) {
            var url = location.toString();
            var tag = url.substring( location.toString().indexOf( "tag=" ) );
            console.log( "标签 ： " + tag );
            $( this ).attr( "href" , $( this ).attr( "href" ) + "&" + tag );
        }
    } );
    /* 记录滚动条的位置 */
    /* 获取滚动条的位置 */
    var scrollCookie = Cookies.get( "scrollCookie_home" );
    if (scrollCookie != null && scrollCookie != "") {
        $( "html,body" ).animate( {
            scrollTop : scrollCookie + "px"
        } , 1000 );
    } else {
        Cookies.set( "scrollCookie_home" , $( document ).scrollTop( "1px" ) );
    }
    var scroll = 0;
    var interval = null;

    // 注销
    $( "#logOff" ).click( function() {
        Cookies.set( "scrollCookie_home" , "1" );
        // 移除新动态标识
        $( "#newTopic" ).removeClass( "src" , "newTopic" );
    } );
    // 隐藏分享面板
    $( ".hiddenTopic" ).click( function() {
        $( "#topic_panel" ).hide( 1000 );
        $( "#preview" ).css( "display" , "none" );
        $( "#preview" ).html( '<span></span>' );
        $( "#upPic" ).attr( "value" , "" );
        $( "#preview" ).html( "" );
    } );
    // 取消显示更多标签
    $( "html" ).click( function( e ) {
        if ($( ".more" ).css( "top" ) != "300px" && $( "#showData" ).size() > 0) {
            $( ".more" ).removeClass( "moreNew" );
            $( ".more" ).text( "更多" );
            $( ".more" ).addClass( "moreAm" );
            $( ".more" ).css( "display" , "table" );

            $( "#showData" ).removeClass( "showdata" );
            $( "#showData ul" ).addClass( "tag_panel" );
            $( "#showData ul li" ).addClass( "tagname" );
            $( "#showData ul li a" ).addClass( "tag" );
            e.stopPropagation();
            return false;
        }
    } );

    // 显示更多标签
    $( ".more" ).click( function( e ) {
        $( "#showData" ).addClass( "showdata" );
        $( ".showdata" ).css( "display" , "block" );
        $( ".more" ).removeClass( "moreAm" );
        $( ".more" ).addClass( "moreNew" );
        $( ".showdata ul" ).removeClass( "tag_panel" );
        $( ".showdata ul li" ).removeClass( "tagname" );
        $( ".showdata ul li a" ).removeClass( "tag" );
        $( this ).text( "" );
        e.stopPropagation();
        return false;
    } );
    // 动画完成后，相关定位
    $( ".more" ).on( "animationend" , function() {
        // 设置5倍按钮的高度
        var height = getNumber( ".showdata" , "height" );
        console.log( "height = " + height );
        $( this ).css( "height" , height / 5 - 16 + 2 + "px" );
        console.log( getNumber( ".more" , "left" ) );
        console.log( getNumber( ".more" , "margin-left" ) );

        // 定位数据div的左边
        var left = getNumber( this , "left" );
        var moreWidth = getNumber( this , "width" );
        console.log( "left = " + left );
        console.log( "morewidth = " + moreWidth );
        var showdataleft = (left - moreWidth * 5 / 2) + 10;
        console.log( "showdataleft = " + showdataleft );
        $( ".showdata" ).css( "left" , showdataleft + "px" );

        // 定位数据div的顶部
        var top = getNumber( ".more" , "top" );
        console.log( "top = " + top );
        $( ".showdata" ).css( "top" , (top - 39 - 1) + "px" );
        var showdatatop = getNumber( ".showdata" , "top" );
        console.log( "showdatatop = " + showdatatop );
        console.log( "showdatatop = " + $( ".showdata" ).css( "top" ) );

        $( ".showdata" ).css( "opacity" , "1" );
    } );
    function getNumber( cssSelector , property ) {
        var propertyStr = $( cssSelector ).css( property );
        var propertyNum = propertyStr.substring( 0 , propertyStr.indexOf( "p" ) );
        return propertyNum;
    }

    console.log( "支持滚动翻页： " + (scrollInPage == true) );
    if (scrollInPage == true) {
        // 滚动条滚动时记录滚动条高度,判断滚动条是否停止滚动，滑动到底部翻页
        $( window ).scroll( scrollPage );
    }

    // 移除滚动翻页事件
    $( "#toggleScrollInPage" ).click( function() {
        // 如果支持滚动翻页，禁止
        if (scrollInPage == true) {
            $( this ).text( "开启滚动翻页" );
            $( window ).unbind( "scroll" );
            var url = "/scrollInPage", args = {
                "_csrf" : csrf
            }
            $.get( url , args , null );
            scrollInPage = false;
        } else {
            $( this ).text( "禁止滚动翻页" );
            $( window ).scroll( scrollPage );
            var url = "/scrollInPage", args = {
                "_csrf" : csrf
            }
            $.get( url , args , null );
            scrollInPage = true;
        }
        return false;
    } );

    function scrollPage() {
        Cookies.set( "scrollCookie_home" , $( document ).scrollTop() );
        if (interval == null) {
            interval = setInterval( checkScroll , 1000 );
        }
        scroll = $( document ).scrollTop();
        // 滑块位置
        var scrollTop = $( this ).scrollTop();
        // 文本总高度
        var scrollHeight = $( document ).height();
        // 滑块本身高度
        var windowHeight = $( this ).height();
        // 滚动到顶部
        if (scrollTop == "0") {
            // 询问框
            layer.confirm( '想看看上一页？' , {
                btn : [ '恩', '不了' ]
            } , function() {
                $( "#lastPage" )[0].click();
            } , function() {
            } );
            return false;
        }

        // 滚动到底部
        if (scrollTop + windowHeight == scrollHeight) {
            // 询问框
            layer.confirm( '想看看下一页？' , {
                btn : [ '恩', '不了' ]
            } , function() {
                $( "#nextPage" )[0].click();
            } , function() {
            } );
            return false;
        }
    }

    // 测试滚动条是否滚动
    function checkScroll() {
        if ($( document ).scrollTop() == scroll) {
            clearTimeout( interval );
            interval = null;
            $( "::-webkit-scrollbar" ).css( "display" , "none" );
            // alert("停止滚动");
        }
    }

    /*
     * =====================================================
     *                                               THE TOPIC CONTAINER
     * =====================================================
     * */
    Date.prototype.format = function( format ) {
        var o = {
            "M+" : this.getMonth() + 1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor( (this.getMonth() + 3) / 3 ), //quarter
            "S" : this.getMilliseconds()
        //millisecond
        }
        if (/(y+)/.test( format )) {
            format = format.replace( RegExp.$1 , (this.getFullYear() + "").substr( 4 - RegExp.$1.length ) );
        }
        for ( var k in o) {
            if (new RegExp( "(" + k + ")" ).test( format )) {
                format = format.replace( RegExp.$1 , RegExp.$1.length == 1 ? o[k] : ("00" + o[k])
                        .substr( ("" + o[k]).length ) );
            }
        }
        return format;
    }
    fileArr = new Array();
    // 文本域自动扩展
    $( ".topic_content" ).TextAreaExpander( 29 , 500 );
    // tab 切换
    $( ".tab-container" ).tabToggle();
    // 图片预览
    $( "#topicPic" ).picPreview( {
        fileArr : fileArr
    } );
    // 添加自定义标签
    $( ".add-custom-tag" ).click(
            function() {
                var val = $( "#custom-tag" ).val();
                if (val != null && $.trim( val ) != "") {
                    console.log( "<li>" + val + "</li>" );
                    var liNode = $( "<li></li>" );
                    var inputNode = $( "<input type='checkbox' name='tags' id='" + val
                            + new Date().format( "yyyyMMddhhmmss" ) + "'  value='" + val + "'/>" );
                    var labelNode = $( "<label for='" + val + new Date().format( "yyyyMMddhhmmss" ) + "'>" + val
                            + "</label>" );
                    liNode.append( inputNode ).append( labelNode );
                    $( this ).prev().before( liNode );
                }
            } );
    // 获取上传token
    var token = "";
    var downDomain = "";
    $.get( "/upload/token" , {} , function( result ) {
        token = result.uptoken;
        downDomain = result.downDomain;
    } );
    // 发布Topic
    var fileRemoteUrl = new Array();
    $( "#publish-topic" ).click( function() {
        // Topic 标签集
        var tags = getTags();
        var content = $( "#topicContent" ).val();
        // 上传文件到七牛
        var formData;
        var files = fileArr;
        console.log( "file arr: " + fileArr );
        for (var i = 0; i < files.length; i++) {
            formData = new FormData();
            formData.append( "file" , files[i] );
            var fileName = files[i].name.substr( 0 , files[i].name.lastIndexOf( "." ) );
            var suffix = files[i].name.substr( fileName.length );
            var key = fileName + "-" + new Date().format( "yyyyMMddhhmmss" ) + suffix;
            formData.append( "key" , key );
            formData.append( "token" , token );
            console.log( "保存文件名: " + key );
            $.ajax( {
                url : "http://up-z2.qiniu.com/",
                type : "post",
                async : false,
                data : formData,
                processData : false,
                contentType : false
            } ).done( function( res ) {
                fileRemoteUrl.push( downDomain + res.key );
                console.log( "文件上传完成: " + downDomain + res.key )
            } ).fail( function( res ) {
                alert( "无法保存图片,请稍后再试" )
            } );
        }
        console.log( "Topic 信息: " );
        console.log( "files[]: " + fileRemoteUrl );
        console.log( "tags[]: " + tags );
        console.log( "content: " + content );
        $.post( "/user/publish" , {
            "tags[]" : tags,
            "content" : content,
            "fileUrls[]" : fileRemoteUrl,
            "_csrf" : $( "#_csrf" ).val()
        } , function( data ) {
            if (data.result == true) {
                layer.msg( "发表成功" , {
                    time : 1800
                } )
                window.location.reload();
            }
        } );
        return false;
    } );

    function getTags() {
        var tags = new Array();
        $( "input[name='tags']:checked" ).each( function() {
            tags.push( $( this ).val() );
        } );
        return tags;
    }

    $( "input.querytopic" ).bind( "blur focus" , function() {
        var extendStyle = "extend-border-bottom";
        $( this ).toggleClass( extendStyle );
    } )
    $( "button.regist_nav_button" ).on( "click" , function( e ) {
        $( this ).parent().removeClass( "is_active" ).next().addClass( "is_active" );
        e.preventDefault();
        $( "li[class*='is_active']" ).removeClass( "is_active" ).next().addClass( "is_active" );

        if ($( this ).parent().index() === 2) {
            $( "ul.regist_title li" ).first().addClass( "is_active" );
            $( "fieldset.regist_main" ).first().addClass( "is_active" );
        }
    } )
    // 登录,注册
    $( "#signInBtn,#signUpBtn" ).click( function() {
        var _form = $( this ).parents( "form" );
        var username = $( _form ).find( "#username" ).val();
        var password = $( _form ).find( "#password" ).val();
        var email = $( _form ).find( "#email" ).val();
        var args = typeof (email) != "undefined" ? {
            "username" : username,
            "password" : password,
            "email" : email,
            "_csrf" : csrf
        } : {
            "username" : username,
            "password" : password,
            "_csrf" : csrf
        }
        $.post( $( _form ).prop( "action" ) , args , function( data ) {
            if (data.result == true) {
                window.location.reload()
            } else {
                layer.msg( data.message , {
                    time : 1800
                } )
            }
        } );
        return false;
    } )
    $( ".profile" ).click( function() {
        $( "section.user-section-nav" ).slideToggle( 500 );
    } )
} )
