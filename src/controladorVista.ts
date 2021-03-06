/// <reference path="jquery.d.ts"/>
/// <reference path="interprete.ts"/>
"use strict";


(function(){

    
    $(document).ready(function(){
        
        $("#ejecutarCodigo").submit(function(event){
                        
            event.preventDefault();
            
            var codigo : string = $("#entrada").val();
            var resultado : number = interpreteScheme.evalExp(codigo);
            var append : string;
            
            if(resultado != null){
                // Correcto
                append = "<div class='resultado'><span class='codigo'><small>&gt;</small> "+codigo+"</span>"+
                                  "<span class='resultado'>"+resultado+"</span></div>";                
                
            } else {                
                // Sintaxis erroneo
                append = "<div class='resultado'><span class='codigo'><small>&gt;</small> "+codigo+"</span>"+
                                  "<span class='resultado error'><i>Error de sintaxis</i></span></div>";                 
                
            }           
            
            // Agregar la string a la pantalla
            $("#resultados").prepend(append);            
            
        });        
        
    });
    
    
})();
 


