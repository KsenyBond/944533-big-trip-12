import Abstract from "../view/abstract.js";

const RenderPosition = {
  AFTER_BEGIN: `afterbegin`,
  BEFORE_END: `beforeend`,
  BEFORE_ELEMENT: `beforebegin`
};

const render = (parentContainer, childElement, place, referenceElement) => {
  if (parentContainer instanceof Abstract) {
    parentContainer = parentContainer.element;
  }

  if (childElement instanceof Abstract) {
    childElement = childElement.element;
  }

  switch (place) {
    case RenderPosition.AFTER_BEGIN:
      parentContainer.prepend(childElement);
      break;
    case RenderPosition.BEFORE_END:
      parentContainer.append(childElement);
      break;
    case RenderPosition.BEFORE_ELEMENT:
      parentContainer.insertBefore(childElement, referenceElement);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const replaceElement = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.element;
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.element;
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace non-existent elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

const removeElement = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error(`Can remove only components`);
  }

  component.element.remove();
  component.removeElement();
};

export {RenderPosition, render, createElement, replaceElement, removeElement};

