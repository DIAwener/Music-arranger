export function setupCounter(element) {
  let counter = 0;
  
  const setCounter = (count) => {
    if (typeof count !== 'number') {
      console.error('Значение счетчика должно быть числом');
      return;
    }
    
    counter = count;
    element.innerHTML = `Значение счетчика: ${counter}`;
  }

  const incrementCounter = () => {
    setCounter(counter + 1);
  }

  const resetCounter = () => {
    setCounter(0); 
  }

  element.addEventListener('click', incrementCounter);
  element.addEventListener('dblclick', resetCounter);

  // Инициализация начального значения
  setCounter(0);
}
