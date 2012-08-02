;(function($) {
	$.fn.placeholder = function(options) {
		var opts = $.extend({}, $.fn.placeholder.defaults, options);
		return this.each(function() {
			var $field = $(this);
      var placeholder_text = $field.data('placeholder');
      var placeholder_id = Math.floor(Math.random() * ((9 * Math.pow(10, 15)) - Math.pow(10, 15) + 1))
      $field.before('<span id="' + placeholder_id + '">' + placeholder_text + '</span>');
			var $label = $('#' + placeholder_id)
			var field_pos = $field.position();
			var label_pos = $field.position();
			var field_width_offset = $field.outerWidth() - $field.innerWidth();
			var field_height_offset = $field.outerHeight() - $field.innerHeight();
			var starting_position = label_pos.left + field_width_offset + opts.padding_start;
      var current_length = 0;
      var read_value = $field.val;
      var tagname = $field.get(0).tagName.toLowerCase();
      if (tagname == 'div') { read_value = $field.text; }
      $field.parent().css({ position: 'relative' })
			$field.css({
				position: 'absolute',
				top: label_pos.top,
				left: label_pos.left,
        'background-color': 'transparent',
				'z-index': 1
			}).keyup(function() {
        current_length = read_value.call($field).length
        if (current_length > 0) {
          $label.hide();
        } else {
          $label.show();
        }
      });
			$label.css({
				position: 'absolute',
				top: label_pos.top + field_height_offset,
				left: starting_position,
				'z-index': 0,
				opacity: opts.opacity
			});
		});
	};

	$.fn.placeholder.defaults = {
		opacity: 0.4,
		padding_start: 8
	}
})(jQuery);
