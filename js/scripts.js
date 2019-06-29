var pokemonRepository = (function () {

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
          addListItem(pokemon);
        });
      },
      error: function(e) {
        console.log('fail');
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
    if (pokemon.hasOwnProperty('name') && pokemon.hasOwnProperty('detailsUrl')) {
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
      var $newListElement = $('<li class ="pokemon-list__item"></li>');

      // create button element and add name to innerText
      var newButtonArgument = '<button type="button" class="btn btn-primary btn-lg btn-block">' + pokemon_item.name + '</button>';
      var $newButtonElement = $(newButtonArgument);

      // append button to list element
      $newListElement.append($newButtonElement)

      //select the unordered list in the DOM and append list item
      $('.pokemon-list').append($newListElement);

      // add click event handler to the new button
      $newButtonElement.on('click', function (event) {
        showDetails(pokemon_item);
      })

  }

  // write the pokemon details to the console log
  function showDetails(pokemon) {
    loadDetails(pokemon).then(function () {
      showModal(pokemon.name, pokemon.height, pokemon.imageUrl);
    });
  }

  function loadDetails(item) {
      var url = item.detailsUrl;
      return $.ajax(url).then(function (details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;
        item.height = details.height;
        item.types = Object.keys(details.types);
      }).catch(function (e) {
        console.error(e);
      });
  }

  function showModal(name, height, imgUrl) {
    // clear existing content
    $('#modal-container').html('');

    var $modal = $('<div class="modal"></div>');

    // Add the content to the modal
    var $closeButtonElement = $('<button type="button" class="btn btn-link modal-close">Close</button>');
    $closeButtonElement.on('click', hideModal);

    var $nameElement = $('<h1>' + name + '</h1>');

    var $heightElement = $('<p> Height: ' + height + '</p>');

    var $imageElement = $('<img src=' + imgUrl + '></img>');

    $modal.append($closeButtonElement);
    $modal.append($nameElement);
    $modal.append($heightElement);
    $modal.append($imageElement);
    $('#modal-container').append($modal);

    $('#modal-container').addClass('is-visible');

  }
  function hideModal() {
    $('#modal-container').removeClass('is-visible');
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && $('#modal-container').hasClass('is-visible')) {
      hideModal();
    }
  });

  $('#modal-container').on('click', (e) => {
    // Since this is also triggered when clicking INSIDE the modal container,
    // We only want to close if the user clicks directly on the overlay
    var $target = $(e.target);
    if ($target.is($('#modal-container'))) {
      hideModal();
    }
  });

  return {
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails
  };

})();

pokemonRepository.loadList();
