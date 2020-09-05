window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
  let elements;
  if (typeof selectorOrArrayOrTemplate === "string") {
    if (selectorOrArrayOrTemplate[0] === "<") {
      // 创建 div
      elements = [createElement(selectorOrArrayOrTemplate)];
    } else {
      // 查找 div
      elements = document.querySelectorAll(selectorOrArrayOrTemplate);
    }
  } else if (selectorOrArrayOrTemplate instanceof Array) {
    elements = selectorOrArrayOrTemplate;
  }

  function createElement(string) {
    const container = document.createElement("template");
    container.innerHTML = string.trim();
    return container.content.firstChild;
  }
  //以jQuery原型链创建一个对象，const api={__proto__:jQuery.prototype}
  const api = Object.create(jQuery.prototype);
  // api.elements = elements;
  // api.oldApi = selectorOrArrayOrTemplate.oldApi;
  //浅拷贝
  Object.assign(api, {
    elements: elements,
    oldApi: selectorOrArrayOrTemplate.oldApi,
  });
  return api;
};

//jQuery把原型取了个名，叫fn
jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  jquery: true,
  get(index) {
    return this.elements[index];
  },
  appendTo(node) {
    if (node instanceof Element) {
      this.each((el) => node.appendChild(el));
    } else if (node.jquery === true) {
      this.each((el) => node.get(0).appendChild(el));
    }
  },
  append(children) {
    if (children instanceof Element) {
      this.get(0).appendChild(children);
    } else if (children instanceof HTMLCollection) {
      for (let i = 0; i < children.length; i++) {
        this.get(0).appendChild(children[i]);
      }
    } else if (children.jquery === true) {
      children.each((node) => this.get(0).appendChild(node));
    }
  },
  find(selector) {
    let array = [];
    for (let i = 0; i < this.elements.length; i++) {
      array = array.concat(
        Array.from(this.elements[i].querySelectorAll(selector))
      );
    }
    array.oldApi = this;
    return jQuery(array);
  },
  each(fn) {
    for (let i = 0; i < this.elements.length; i++) {
      fn.call(null, this.elements[i], i);
    }
    return this;
  },
  parent() {
    const array = [];
    this.each((node) => {
      if (array.indexOf(node.parentNode) === -1) {
        array.push(node.parentNode);
      }
    });
    return jQuery(array);
  },
  print() {
    console.log(this.elements);
  },
  children() {
    const array = [];
    this.each((node) => {
      array.push(...node.children);
    });
    return jQuery(array);
  },
  addClass(className) {
    for (let i = 0; i < this.elements.length; i++) {
      this.elements[i].classList.add(className);
    }
    return this;
  },
  end() {
    return this.oldApi;
  },
};
