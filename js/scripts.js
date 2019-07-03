/*eslint-env jquery*/
var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function loadList() {
    $.ajax({
      type: 'GET',
      url: apiUrl,
      success: function(data) {
        $.each(data.results, function(i, item) {
          var pokemon = {
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          loadDetails(pokemon).then(function() {
            addListItem(pokemon);
          });
        });
      },
      error: function(e) {
        alert(e);
      }
    });
  }

  // function to add a pokemon character to the registry
  function add(pokemon) {
    // verify what is being added is an object
    var isObject = 0;
    if (typeof pokemon === 'object') {
      isObject = 1;
    }

    // verify the object has the name, height and types keys
    var typeOK = 1;
    if (
      pokemon.hasOwnProperty('name') &&
      pokemon.hasOwnProperty('detailsUrl')
    ) {
      typeOK = 1;
    } else {
      typeOK = 0;
    }

    // if type and keys are correct, add pokemon to repository
    if (isObject && typeOK) {
      repository.push(pokemon);
    }
  }
  // add a repository pokemon to the main page as a button with pokemon name
  function addListItem(pokemon_item) {
    // create list element
    var $newListElement = $('<li class ="list-group-item"></li>');

    // create button element and add name to innerText
    var newButtonArgument =
      '<button type="button" class="btn btn-primary btn-lg btn-block" data-toggle="modal" data-target="#exampleModal" data-name=' +
      pokemon_item.name +
      ' data-height=' +
      pokemon_item.height +
      ' data-imageurl=' +
      pokemon_item.imageUrl +
      ' >' +
      pokemon_item.name +
      '</button>';
    var $newButtonElement = $(newButtonArgument);

    // append button to list element
    $newListElement.append($newButtonElement);

    //select the unordered list in the DOM and append list item
    $('.list-group').append($newListElement);
  }

  function loadDetails(item) {
    var url = item.detailsUrl;
    return $.ajax(url)
      .then(function(details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = Object.keys(details.types);
      })
      .catch(function(e) {
        alert(e);
      });
  }

  $('#exampleModal').on('show.bs.modal', function(event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var name = button.data('name'); // Extract info from data-* attributes
    var height = button.data('height'); // Extract info from data-* attributes
    var image = button.data('imageurl'); // Extract info from data-* attributes
    var modal = $(this);
    modal.find('.modal-body').html('');
    modal.find('.modal-title').text(name);

    var $heightElement = $('<p> Height: ' + height + '</p>');
    var $imageElement = $('<img src=' + image + '></img>');
    modal.find('.modal-body').append($heightElement);
    modal.find('.modal-body').append($imageElement);
  });

  return {
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

pokemonRepository.loadList();
