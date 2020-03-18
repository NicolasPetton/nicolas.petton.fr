let tags = (
  "a abbr acronym address area article aside audio b bdi bdo big " +
  "blockquote body br button canvas caption cite code col colgroup command " +
  "datalist dd del details dfn div dl dt em embed fieldset figcaption figure " +
  "footer form frame frameset h1 h2 h3 h4 h5 h6 hr head header hgroup html i " +
  "iframe img input ins kbd keygen label legend li link map mark meta meter " +
  "nav noscript object ol optgroup option output p param pre progress q rp rt " +
  "ruby samp script section select slot small source span strong style sub " +
  "summary sup table tbody td textarea tfoot th thead time title tr track tt " +
  "ul var video wbr"
).split(" ");

let attributes = "href for id media rel src style title type".split(" ");

let omitSymbol = {};

let events = (
  "blur focus focusin focusout load resize scroll unload " +
  "click dblclick mousedown mouseup mousemove mouseover " +
  "mouseout mouseenter mouseleave change input select submit " +
  "keydown keypress keyup error dragstart dragenter dragover dragleave drop dragend"
).split(" ");

class HtmlCanvas {
  constructor(root) {
    this.root = new TagBrush({ element: root });
  }

  tag(tagName, children) {
    let tagBrush = new TagBrush({ tag: tagName, children: children });
    this.root.appendBrush(tagBrush);
    return tagBrush;
  }

  omit() {
    return omitSymbol;
  }

  render() {
    this.root.render(...arguments);
  }
}

tags.forEach(function(tagName) {
  HtmlCanvas.prototype[tagName] = function() {
    let args = Array.prototype.slice.call(arguments);
    return this.tag(tagName, args);
  };
});

class TagBrush {
  constructor({ tag, element, children } = {}) {
    this.element = element ? element : this.createElement(tag);

    if (!this.element) {
      throw new Error("TagBrush requires an element");
    }

    if (children) {
      this.append(children);
    }
  }

  createElement(tagName) {
    if (tagName) {
      return document.createElement(tagName);
    } else {
      return document.createDocumentFragment();
    }
  }

  append(object) {
    if (object.appendToBrush) {
      object.appendToBrush(this);
      return;
    }

    // Assume attributes
    if (typeof object === "object") {
      this._attr(object);
      return;
    }

    throw new Error("Unsupported data type");
  }

  appendChild(child) {
    if (this.element.canHaveChildren !== false) {
      this.element.appendChild(child);
    } else {
      this.element.text = this.element.text + child.innerHTML;
    }
  }

  appendBrush(aTagBrush) {
    this.appendChild(aTagBrush.element);
  }

  appendString(string) {
    this.appendChild(document.createTextNode(string));
  }

  appendFunction(fn) {
    fn(new HtmlCanvas(this));
  }

  appendElement(element) {
    this.appendChild(element);
  }

  render(...args) {
    this.append(args);
  }

  appendToBrush(aTagBrush) {
    aTagBrush.appendBrush(this);
  }

  addEventListener(type, handler) {
    this.element.addEventListener(type, handler);
  }

  setAttribute(key, value) {
    // Omit attribute if value is omit
    if (value === omitSymbol) {
      return;
    }

    this.element.setAttribute(key, value);
  }

  _attr(object) {
    for (let key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        // Attach functions
        if (typeof object[key] === "function") {
          this.addEventListener(key, object[key]);
        } else if (key === "klass") {
          this.element.className = object[key];
        } else {
          this.setAttribute(key, object[key]);
        }
      }
    }
    return this;
  }
}

events.forEach(function(eventType) {
  TagBrush.prototype[eventType] = function(callback) {
    return this.addEventListener(eventType, callback);
  };
});

attributes.forEach(function(attributeName) {
  TagBrush.prototype[attributeName] = function(value) {
    return this.setAttribute(attributeName, value);
  };
});

omitSymbol.appendToBrush = brush => {};

String.prototype.appendToBrush = function(brush) {
  brush.appendString(this);
};

Function.prototype.appendToBrush = function(brush) {
  brush.appendFunction(this);
};

Number.prototype.appendToBrush = function(brush) {
  this.toString().appendToBrush(brush);
};

Array.prototype.appendToBrush = function(brush) {
  let length = this.length;
  for (let i = length - 1; i >= 0; i--) {
    brush.append(this[length - i - 1]);
  }
};

HTMLElement.prototype.appendToBrush = function(brush) {
  brush.appendElement(this);
};

export default HtmlCanvas;
