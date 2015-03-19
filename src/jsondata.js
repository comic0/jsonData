(function($){

    var JSON_TYPE = {
        JSON_TYPE_NO_OBJECT: 0,
        JSON_TYPE_ARRAY: 1,
        JSON_TYPE_OBJECT: 2,
        JSON_TYPE_NULL: 3
    };

    function JSONObject(){

        var self = this;

        var m_data;
        var m_type;

        function construct( data ){

            m_data = parseJSON(data)||null;
            m_type = JSON_TYPE.JSON_TYPE_NO_OBJECT;

            initType();
        }

        function initType(){

            if( $.isArray(m_data) )
                m_type = JSON_TYPE.JSON_TYPE_ARRAY;
            else if( $.isPlainObject(m_data) )
                m_type = JSON_TYPE.JSON_TYPE_OBJECT;
            else
                m_type = JSON_TYPE.JSON_TYPE_NULL;
        }

        function parseJSON( data ){

            if( typeof(data)=="string" ){

                try {

                    return $.parseJSON(data);

                } catch( e ){ return null; };
            }

            return data;
        }

        function find( pattern, obj ){

            var src = obj||m_data;
            var path = pattern.toString().split(".");

            for( var i=0; i<path.length; i++ ){

                var key = path[i];
                var src = src[key];

                if( src==undefined )
                    return undefined;
            }

            return src;
        }

        function echo( str, data ){

            return str.replace(/\$\{([a-zA-Z0-9.]+)\}/g, function(val){

                var key = val.substr(2, val.length-3);
                return find(key, data);
            });
        }

        function clone( obj ){

            if( $.isArray(obj) ){

                var result = [];

                for( var i=0; i<obj.length; i++ )
                    result.push(clone(obj[i]));

                return result;

            } else if( $.isPlainObject(obj) ) {

                var result = {};

                for( var i in obj )
                    result[i] = clone(obj[i]);

                return result;
            }

            return obj;
        }

        this.isArray = function(){

            return m_type==JSON_TYPE.JSON_TYPE_ARRAY;
        };

        this.isObject = function(){

            return m_type==JSON_TYPE.JSON_TYPE_OBJECT;
        };

        this.clone = function(){

            return new JSONObject(clone(m_data));
        };

        this.find = function( pattern ){

            return new JSONObject(find(pattern, m_data));
        };

        this.value = function( search ){

            if( search!=undefined )
                return find(search, m_data);

            return m_data;
        };

        this.each = function( callback ){

            for( var i in m_data )
                callback.apply( self, [m_data[i],i] );

            return self;
        };

        this.echo = function( str ){

            return echo(str, m_data);
        };

        this.html = function( tag, options ){

            var html = new $();

            if( typeof(options)=="string" )
                options = {html:options};

            self.each(function(value, key){

                var item = $(tag);

                item.data(value);
                item.addClass(options.class);
                item.html(echo(options.html, value));

                html = html.add(item);
            });

            return html;
        };

        this.join = function( glue, value ){

            var data = clone(m_data);

            if( value!=undefined ){

                data = [];
                self.each(function(val, key){ data.push(echo(value, val)); });
            }

            if( $.isArray(glue) && glue.length==2 ){

                var last = data.pop();
                return (data.length>0)? data.join(glue[0])+glue[1]+last : data.join(glue[0]);

            } else return data.join(glue);
        }

        this.length = function(){

            return m_data.length;
        };

        this.size = function(){

            if( self.length()!=undefined )
                return m_data.length;

            var size = 0;

            self.each(function(){ size++; });

            return size;
        };

        this.push = function( obj, key ){

            if( key==undefined )
                m_data.push(obj);
            else
                m_data[key] = obj;

            return self;
        }

        construct.apply( self, arguments );
    }

    window['jsonData'] = function(object){ return new JSONObject(object); };

})(window.jQuery);
