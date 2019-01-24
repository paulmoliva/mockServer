var port = chrome.extension.connect({
  name: "Sample Communication"
});

function handleChange(event) {
  port.postMessage(event.target.value);
}

function addListItem(value) {
  const li = document.createElement('li');
  let t = document.createTextNode(value);
  li.appendChild(t);
  const btn = document.createElement('button');
  t = document.createTextNode(`remove ${value}`);
  btn.appendChild(t);
  btn.id = `remove-${value}`;
  li.appendChild(btn);
  document.getElementById('list').appendChild(li);
  btn.addEventListener('click', () => {
    btn.parentNode.parentNode.removeChild(li);
    port.postMessage(`$$$ ${value}`);
  });
}

window.onload = () => {
  port.onMessage.addListener(function(msg) {
    const matchers = JSON.parse(msg);
    matchers.forEach(addListItem)
  });
  port.postMessage('***give-matchers-please***');
  document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('myInput');
    const { value } = input;
    port.postMessage(value);
    addListItem(value);
    input.value = '';
    input.focus();
  })
}
