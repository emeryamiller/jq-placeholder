;(function($) {

	$.fn.placeholder = function(options) {
    var pixels_to_int = function(pixels) {
      return parseInt(pixels.replace('px', ''));
    };
    var field_padding = function($fld) {
      result = {}
      $.each(['top', 'left', 'right', 'bottom'], function(index, area) {
        result[area] = 0;
        $.each(['margin', 'border', 'padding'], function(index, kind) {
          result[area] += pixels_to_int($fld.css(kind+'-'+area));
        });
      });
      return result;
    };

		return this.each(function() {
      var opts = $.extend({}, $.fn.placeholder.defaults, options);
			var $field = $(this);
      if ($field.data('placeholder_active')) {
        keystorke_handler();
        return;
      } else {
        $field.data('placeholder_active', true);
      }
      var $label;
      var placeholder_text = $field.data('placeholder');
      if (!placeholder_text) {
        $prev_label = $field.prev('label')
        placeholder_text = $prev_label.text();
        if (placeholder_text) {$prev_label.hide();}
      }
      if (!placeholder_text) { return; }
      $label = $('<span class="placeholder">' + placeholder_text + '</span>');
      $field.after($label);
      $field.parent().css({ position: 'relative' })
      $label.css({position: 'absolute'});  // Remove it from the flow

			var field_pos = $field.position();
      var field_surround = field_padding($field);
      var label_top = field_pos.top + field_surround.top + opts.padding_top;
      var label_left = field_pos.left + field_surround.left + opts.padding_left;
      var label_right = field_pos.left + $field.outerWidth(true) - field_surround.right - opts.padding_right;
      var label_rightmost_left = label_right - $label.outerWidth(true);

      if (label_rightmost_left < label_left) {
        label_rightmost_left = label_left;
        opts.slide = false;
      }

      if (!opts.slide) { opts.vanishing_length = 0; }

      var current_length = 0;
      var tagname = $field.get(0).tagName.toLowerCase();
      var read_value = $field.val;
      if (!(tagname === 'input' || tagname === 'textarea')) { read_value = $field.text; }

      var keystroke_handler = function(e) {
          current_length = read_value.call($field).length
          if (e && e.type === 'keypress') { current_length += 1; }
          if (current_length > opts.vanishing_length) {
            $label.fadeOut();
          } else {
            $label.show();
          }
      }

			$label.css({
				top: label_top,
				left: label_left
			}).mousedown(function(e) {
        e.preventDefault();
        $field.focus();
      });

			$field.addClass('placeheld').focus(function() {
        if (opts.slide) {
          $label.stop().animate({
            left: label_rightmost_left
          }, opts.focus_speed);
		  	}
      }).blur(function() {
        if (!current_length && opts.slide) {
          $label.stop().animate({
            left: label_left
          }, opts.blur_speed);
        }
      }).bind('keyup keypress', keystroke_handler);

      keystroke_handler();
      active_ele = document.activeElement
      if (active_ele) {
        if ((active_ele) === this) { $field.focus(); }
      }
		});
	};

	$.fn.placeholder.defaults = {
		focus_speed: 600,
		blur_speed: 600,
		padding_top: 0,
		padding_left: 1,
		padding_right: 0,
		padding_bottom: 0,
    vanishing_length: 5,
    slide: true
	}

})(jQuery);
