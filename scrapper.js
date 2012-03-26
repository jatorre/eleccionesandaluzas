var http = require('http');  
var csv = require('ya-csv');
//var $ = require('jquery');
var jsdom = require('jsdom');


data = require('./data.json')

var writer = csv.createCsvStreamWriter(process.stdout);
//writer.writeRecord(["partido_1","votos_1","porcen_1","partido_2","votos_2","porcen_2","partido_3","votos_3","porcen_3","name_2_url","name_4_url"]);

//for (var y = 0; y < data.rows.length; y++) {
for (var y = 0; y < data.rows.length; y++) {
    
    //STUPID HACK
    if(data.rows[y].name_4_url.match("^la-")) {
        data.rows[y].name_4_url = data.rows[y].name_4_url.replace("la-","")+"-la";
    }
    if(data.rows[y].name_4_url.match("^el-")) {
        data.rows[y].name_4_url = data.rows[y].name_4_url.replace("el-","")+"-el";
    }
    if(data.rows[y].name_4_url.match("^los-")) {
        data.rows[y].name_4_url = data.rows[y].name_4_url.replace("los-","")+"-los";
    }
    if(data.rows[y].name_4_url.match("^las-")) {
        data.rows[y].name_4_url = data.rows[y].name_4_url.replace("las-","")+"-las";
    }
    //END STUPID HACK         
    var options = {  
              host: 'resultados-elecciones.rtve.es',   
              path: '/andalucia/'+data.rows[y].name_2_url+'/'+data.rows[y].name_4_url
         };   
    var req = http.get(options, function(res) {
        var page = "";
        res.on('data', function(chunk) {page += chunk;});   
        res.on('end', function() {            
            jsdom.env({
                    html: page,
                    scripts: ['http://code.jquery.com/jquery-1.6.min.js']
                }, function(err, window){
                    
                    
                    //Use jQuery just as in a regular HTML page
                    var $ = window.jQuery;
                    writer.writeRecord([
                        $.trim($($('tr')[2].children[0]).text()),
                        $.trim($($('tr')[2].children[1]).text()),
                        $.trim($($('tr')[2].children[2]).text()),
                        $.trim($($('tr')[3].children[0]).text()),
                        $.trim($($('tr')[3].children[1]).text()),
                        $.trim($($('tr')[3].children[2]).text()),
                        $.trim($($('tr')[4].children[0]).text()),
                        $.trim($($('tr')[4].children[1]).text()),
                        $.trim($($('tr')[4].children[2]).text()),
                        $.trim($($('#secondary-nav').children()[0]).text()),
                        $.trim($($('#secondary-nav').children()[1]).text())
                    ]);
                    
                    
            });
        });
    });
}

/*


var items=[];

var i=0;
call(1);
var ids=[];



function call(i) {
    var options = {  
              host: 'api.idescat.cat',   
              path: '/pob/v1/cerca.json?tipus/mun;posicio/'+i  
         };   
    var req = http.get(options, function(res) {  
         var data = "";
         res.on('data', function(chunk) {data += chunk;});   
         res.on('end', function() {
             var tmpData=JSON.parse(data);
             its = tmpData.feed.entry;
             //console.log(tmpData.feed.entry);
             for (var ii = 0; ii < its.length; ii++) {
                 
                 if($.inArray(its[ii].id, ids)<0) {
                     ids.push(its[ii].id);
                     var men=0;
                     var female=0;
                     var total=0;
    
                     for (var y = 0; y < its[ii]["cross:DataSet"]["cross:Section"]["cross:Obs"].length; y++) {
                        if(its[ii]["cross:DataSet"]["cross:Section"]["cross:Obs"][y]["SEX"]=="M"){
                            men = its[ii]["cross:DataSet"]["cross:Section"]["cross:Obs"][y]["OBS_VALUE"];
                        }
                        if(its[ii]["cross:DataSet"]["cross:Section"]["cross:Obs"][y]["SEX"]=="F"){
                            female = its[ii]["cross:DataSet"]["cross:Section"]["cross:Obs"][y]["OBS_VALUE"];
                        }
                        if(its[ii]["cross:DataSet"]["cross:Section"]["cross:Obs"][y]["SEX"]=="T"){
                            total = its[ii]["cross:DataSet"]["cross:Section"]["cross:Obs"][y]["OBS_VALUE"];
                        }                                        
                     }
                 
                     items.push({
                         title:its[ii].title,
                         id:its[ii].id,
                         link:its[ii].link.href,
                         content:its[ii].content.content,
                         category:its[ii].category[0].term,
                         men:men,
                         female:female,
                         total:total
                     });
                     writer.writeRecord([
                          its[ii].title,
                          its[ii].id,
                          its[ii].link.href,
                          its[ii].content.content,
                          its[ii].category[0].term,
                          men,
                          female,
                          total
                      ]);
                  }
             }
             //947
             if(i<947) {
                 i++;
                 call(i);
             } else {
                 //console.log(items);
             }
         });   
    })
}

*/