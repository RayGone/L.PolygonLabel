function AddLabelToGeoJSON(geojson,map,option = {}){
    options = {
        LabelMaxFontSize:38,
        LabelMinFontSize:8,
        LabelStyleClass:none,
        LabelMaxLength: 10,
        LabelFeatureProperty:none
    }

    for(let i in option){
        options[i] = option[i];
    }

    if(!options.LabelFeatureProperty) throw new Error('LabelFeatureProperty not provided');
    
    var geoJSONLayer = L.geoJson(geojson);
    var finalZoomLevel = map.getBoundsZoom(geoJSONLayer.getBounds());

    
    function zoomFontSizeFactor(zoomFrom,zoomTo){
        var zoomDiff = (zoomFrom-zoomTo);
        if(zoomTo>zoomFrom || zoomDiff<0.1) return zoomFrom;
        else if(zoomDiff<=0.5) return zoomFrom*Math.PI*0.35;
        else if(zoomDiff<=1.1) return zoomFrom*Math.PI*0.41;
        else if(zoomDiff<=1.5) return zoomFrom*Math.PI*0.47;
        else if(zoomDiff<=2.1) return zoomFrom*Math.PI*0.53;
        else if(zoomDiff<=2.4) return zoomFrom*Math.PI*0.6;
        else if(zoomDiff<=2.8) return zoomFrom*Math.PI*0.66;
        else if(zoomDiff<=3.1) return zoomFrom*Math.PI*0.72;
        else if(zoomDiff<=3.4) return zoomFrom*Math.PI*0.78;
        else if(zoomDiff<=3.8) return zoomFrom*Math.PI*0.84;
        else if(zoomDiff<=4.1) return zoomFrom*Math.PI*0.9;
        else if(zoomDiff<=4.5) return zoomFrom*Math.PI*0.96;
        else return zoomFrom*Math.PI;
        // else if(zoomDiff<=5.5) return zoom*Math.PI*0.8;
        // else if(zoomDiff<=6.1) return zoom*Math.PI*0.85;
        // else if(zoomDiff<=6.5) return zoom*Math.PI*0.9;
        // else if(zoomDiff<=7.1) return zoom*Math.PI*0.95;
        // else if(zoomDiff<=7.5) return zoom*Math.PI*1.2;
        // else return zoom*Math.PI*1.5;
    }
        
    function textPixelLength(text,psize){
        var c = document.querySelector('canvas');
        if(!c){
            c = document.createElement('canvas');
        }
        var ctx = c.getContext("2d");
        
        ctx.font = psize+"px Arial";
        return ctx.measureText(text).width
    }

    L.geoJson(geojson, {
        onEachFeature: function(f, l) {
            var label = f.properties[options.LabelFeatureProperty];

            var sw = l.getBounds().getSouthWest();
            var se = l.getBounds().getSouthEast();
            var c = l.getBounds().getCenter();
            var nw = l.getBounds().getNorthWest();
            var ne = l.getBounds().getNorthEast();

            var yDiff = Math.abs(sw.lat - nw.lat);
            var xDiff = Math.abs(sw.lng - se.lng);

            var zoom = map.getBoundsZoom(l.getBounds());//----
            var fontsize = options.LabelMaxFontSize*finalZoomLevel/zoomFontSizeFactor(zoom,finalZoomLevel);//--- calculating approx. font size for finalZoomLevel

            if(label.length>options.LabelMaxLength)label = label.substr(0,options.LabelMaxLength)+"..";
            
            // console.log({label,maxZoomFontSize,finalZoomLevel,zoom,fontsize});
            var markerposition = c;
            //adding text in center of polygon
            var hw_flag;
            var style;
            if(LabelStyleClass){
                style = "font-size:"+fontsize+"px !important;";
            }else{
                style = "color:black;background-color:none;text-shadow: 1px 1px 2px #666;font-size:"+fontsize+"px !important;font-weight:400";
            } 

            if(fontsize>=options.LabelMinFontSize){
                if(xDiff>yDiff){
                    hw_flag = 'w';
                    L.marker(markerposition,{icon:L.divIcon({html:"<div id='"+label+"' class='"+options.LabelStyleClass+"' style='"+style+"'>"+label+"</div>",className:'none'})}).addTo(map);
                }else{
                    hw_flag = 'h';
                    L.marker(markerposition,{icon:L.divIcon({html:"<div id='"+label+"' class='"+options.LabelStyleClass+"'  style='"+style+";transform:rotate(90deg) !important;'>"+label+"</div>",className:'none'})}).addTo(map);
                    
                }
            }      

            //aligning label text to center
            var ldiv = document.getElementById(label)
            if(ldiv){//if label is put
            var cdiv = textPixelLength(label,fontsize)/2;
            ldiv.style.position='relative';
            if(hw_flag == 'h'){
                ldiv.style.top = "-"+cdiv+"px";
                ldiv.style.left = "-"+(fontsize/2)+"px";
            }else{
                ldiv.style.left = "-"+cdiv+"px";
                ldiv.style.top = "-"+(fontsize/2)+"px";
            }
            }
        }
    });
}
