# jsonData #

## Installation ##

Il est nécessaire d'inclure jQuery dans la page pour faire fonctionner jsonData. 

``` html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
        <script src="src/jsondata.min.js"></script>
        
        <title>Sample</title>
    </head>
    <body>
    </body>
</html>
```


## Utilisation ##

Initialisation de l'objet :
``` js
var users = [
    {id:1, firstname:'John', lastname:'Doe', infos:{age:25, country:'US'}}, 
    {id:2, firstname:'Alex', lastname:'Durand', infos:{age:17, country:'FR'}},
    {id:3, firstname:'John', lastname:'Smith', infos:{age:40, country:'FR'}}
];
var data = jsonData(users);
```

Récuperer le nombre d'éléments dans l'objet : 
``` js 
var count = data.length();
// 3 - Ne retourne une valeur que pour les Array (undefined dans le cas d'un Object)

var count = data.size();
// 3 - Compte le nombre d'éléments, quelque soit le type d'objet
```

Parcourir les éléments :
``` js 
data.each(function(value, key){
    
    console.log(key, value);
});
```

Récupérer le contenu de l'objet : 

``` js 
var value = data.value(); 
// Aura le même contenu que l'objet users
```

Explorer l'objet : 
``` js
var user = data.find(2).value();
// {id:3, firstname:'John', lastname:'Smith', infos:{age:40, country:'US'}}

var user = data.find("2.infos").value();
// {age:40, country:'US'}
```

Construire une chaine de caractères à partir des données de l'objet :
``` js
data.echo("Salut ${0.firstname} ${0.lastname}, comment vas-tu ?");
// "Salut John Doe, comment vas-tu ?"

data.find(2).echo("${firstname} ${lastname}, tu as ${infos.age} ans et tu viens de ${infos.country}.");
// "John Smith, tu as 40 ans et tu viens de FR."
```

Construire une liste d'éléments html à partir d'un array : 
``` js 
var li = data.html("<li>", {html:"${firstname} ${lastname} (${infos.country})", class:"user"});
// Retourne un objet jQuery contenant : 
// [<li class="user">John Doe (US)</li>,
//  <li class="user">Alex Durand (FR)</li>, 
//  <li class="user">John Smith (FR)</li>];

$("ul.users").append(li);
```

Rassembler les éléments en une chaine : 
``` js 
data.join(", ", "${firstname} ${lastname}");
// "John Doe, Alex Durand, John Smith"

data.join([", ", " et "], "${firstname} ${lastname}");
// "John Doe, Alex Durand et John Smith"
```

