/// <reference path="nodos.ts"/>
"use strict";
var interpreteScheme;
(function (interpreteScheme) {
    /* Expresion de la forma (+ a b) o tambien puede ser (+ () ()) es decir con mas expresiones dentro */
    /* El retorno de este Regex es la operacion, y los dos argumentos JUNTOS en una sola variable */
    var expresionOperacion = /^\s*\(\s*([\+|\-|\*|\/])\s+((?:\-{0,1}[0-9]+(?:\.[0-9]+)?|\(.+\))\s+(?:\-{0,1}[0-9]+(?:\.[0-9]+)?|\(.+\)))\s*\)\s*$/;
    /* Valor numerico */
    var expresionValorPrimitivo = /^\s*(\-{0,1}[0-9]+(?:\.[0-9]+)?)\s*$/;
    /* Verifica que un codigo de Scheme tenga parentesis balanceados */
    function esBalanceada(str) {
        var nivel = 0;
        for (var i = 0; i < str.length; i++) {
            if (str[i] == '(') {
                nivel++;
            }
            else if (str[i] == ')') {
                nivel--;
                if (nivel == -1)
                    return false;
            }
        }
        if (nivel == 0)
            return true;
        return false;
    }
    // Entrada: string con ambos argumentos (string preprocesada sin espacios extra)
    // Salida: un arreglo de dos strings, cada una con un argumento
    function splitArgs(str) {
        var arreglo = [];
        if (str[0] == '(') {
            // El caso en donde el primero es una expresion con parentesis
            // Se debe contar hasta que quede balanceado
            var nivel = 1;
            for (var i = 1; i < str.length; i++) {
                if (str[i] == '(') {
                    nivel++;
                }
                else if (str[i] == ')') {
                    nivel--;
                    if (nivel == 0)
                        break;
                }
            }
            arreglo[0] = str.substring(0, i + 1);
            arreglo[1] = str.substring(i + 2);
            return arreglo;
        }
        else {
            // El primero es un numero
            arreglo = str.split(/ (.+)?/, 2);
            return arreglo;
        }
    }
    function compilarRecursivo(str) {
        /*
        Resumen del algoritmo:
        
        Funcion recursiva
        Caso generico: expresion con parentesis y dos argumentos
        Caso base: valor numerico.
        
        Cuando es con parentesis, se usa la expresion regular para obtener la operacion
        y argumentos (en una sola string ambos, porque JS no soporta regex recursivo) y
        luego se parten los argumentos usando splitArgs().
        
        Luego se compilan ambos argumentos (recursividad), y se crea un nodo usando
        estos argumentos compilados, los cuales a su vez tambien fueron convertidos en nodos,
        por lo tanto se obtiene un arbol.
        */
        if (!esBalanceada(str)) {
            return null;
        }
        // Al hacer el match() se extraen algunas strings aqui
        var extraidos;
        // Probar usando una operacion del tipo (+ a b) o (+ () ())
        if ((extraidos = str.match(expresionOperacion)) != null) {
            // extraidos[1] contiene la operacion
            // extraidos[2] contiene ambos argumentos
            // Los argumentos no se pueden separar usando Regex en Javascript
            // Por eso se separan usando esta funcion...
            var args = splitArgs(extraidos[2]);
            var arg1 = args[0];
            var arg2 = args[1];
            // Compilar las dos expresiones que hay dentro del (+ a b)        
            arg1 = compilarRecursivo(arg1);
            arg2 = compilarRecursivo(arg2);
            if (arg1 == null || arg2 == null) {
                return null;
            }
            var objFactory = {
                operacion: extraidos[1],
                arg1: arg1,
                arg2: arg2
            };
            return NodoFactory.crearNodo(objFactory);
        }
        // Probar usando valor primitivo
        if ((extraidos = str.match(expresionValorPrimitivo)) != null) {
            // La expresion es un valor numerico primitivo, asi que se compila
            // un nodo de valor primitivo. Aca se acaba la recursion.
            return NodoFactory.crearNodo({ valorNumerico: extraidos[1] });
        }
    }
    /* Compila un codigo de Scheme y retorna el primer nodo del arbol */
    function compilar(str) {
        // Aca se preprocesa la string
        str = str.replace(/\s+/g, " "); // Eliminar espacios dobles
        str = str.trim(); // Sacar espacios de los extremos                       
        return compilarRecursivo(str);
    }
    function evalExp(str) {
        // Compilar el codigo en un arbol, y obtener una referencia al nodo origen
        var nodoPrincipal = compilar(str);
        if (nodoPrincipal == null)
            return null;
        return nodoPrincipal.eval();
    }
    interpreteScheme.evalExp = evalExp;
})(interpreteScheme || (interpreteScheme = {}));
//# sourceMappingURL=interprete.js.map