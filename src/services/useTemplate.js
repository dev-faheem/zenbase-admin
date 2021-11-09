const addTemplateClass = (className) => {
  if (!hasTemplateClass(className)) {
    document.body.classList.add(className);
  }
};
const removeTemplateClass = (className) => {
  if (hasTemplateClass(className)) {
    document.body.classList.remove(className);
  }
};
const hasTemplateClass = (className) => {
  return document.body.classList.contains(className);
};
const toggleTemplateClass = (className) => {
  if (hasTemplateClass(className)) {
    removeTemplateClass(className);
  } else {
    addTemplateClass(className);
  }
};

const setDarkMode = (mode = true) => {
  if (mode === true) {
    addTemplateClass("dark-mode");
  } else {
    removeTemplateClass("dark-mode");
  }
};

const toggleDarkMode = () => {
  if (getDarkMode()) {
    setDarkMode(false);
  } else {
    setDarkMode(true);
  }
};

const getDarkMode = () => {
  return hasTemplateClass("dark-mode");
};

export default function useTemplate() {
  return {
    addTemplateClass,
    removeTemplateClass,
    hasTemplateClass,
    toggleTemplateClass,
    setDarkMode,
    toggleDarkMode,
    getDarkMode,
  };
}
