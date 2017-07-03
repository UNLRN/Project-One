var $tabs = $('.tabs')

$tabs.on('click', 'li', function (e) {
	e.preventDefault();
  // Variables
  var $this = $(this)
	var id = $this.children('a').attr('href');
  var $tabactive = $('li').filter('.current');
  var $panelactive = $('.panels').filter(':not(:hidden)');
  var $spanactive = $tabs.find('span').filter(':not(:hidden)')
  
  // Visibility
  $spanactive.fadeToggle(0);
  $panelactive.fadeToggle(0);
  $(id).fadeToggle(500);
  $this.find('span').fadeToggle(500);
	
  // Classes
	$tabactive.removeClass(['current', 'col-xs-6']);
  $tabactive.addClass('col-xs-2')
  $this.removeClass('col-xs-2');
	$this.addClass('current col-xs-6');
})