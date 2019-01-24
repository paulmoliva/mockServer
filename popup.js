var port = chrome.extension.connect({
  name: "Sample Communication"
});

function handleChange(event) {
  port.postMessage(event.target.value);
}

function createInputElement(placeholder, type, value, onChange) {
  const input = document.createElement('input');
  input.placeholder = placeholder;
  input.type = type;
  input.value = value;
  input.addEventListener('change', onChange)
  return input;
}

function createStatusInput(value, parent) {
  const postStatusCodeUpdate = e => {
    port.postMessage(JSON.stringify({
      type: 'updateStatusCode',
      key: value,
      payload: e.target.value,
    }))
  };
  const statusInput = createInputElement(
    'Status Code',
    'number',
    422,
    postStatusCodeUpdate,
  );
  parent.appendChild(statusInput);
}

function createResponsePair(key, value, parent) {
  const keyInput = createInputElement(
    'key',
    'text',
    '',
    () => {},
  );
  const valueInput = createInputElement(
    'value',
    'text',
    '',
    () => {},
  );
}

function addListItem(value) {
  const li = document.createElement('li');
  let t = document.createTextNode(value);
  li.appendChild(t);
  li.id = value;
  const btn = document.createElement('button');
  t = document.createTextNode(`remove ${value}`);
  btn.appendChild(t);
  btn.id = `remove-${value}`;
  li.appendChild(btn);
  document.getElementById('list').appendChild(li);
  btn.addEventListener('click', () => {
    btn.parentNode.parentNode.removeChild(li);
    port.postMessage(JSON.stringify({
      type: 'removeMatcher',
      key: value,
    }));
  });
  createStatusInput(value, li);
}

const postMessageAndAddListItem = (event) => {
  event.preventDefault();
  const input = document.getElementById('myInput');
  const { value } = input;
  port.postMessage(JSON.stringify({
    type: 'addMatcher',
    key: value,
  }));
  addListItem(value);
  input.value = '';
  input.focus();
};

window.onload = () => {
  port.onMessage.addListener(function(msg) {
    const matchers = JSON.parse(msg);
    matchers.forEach(addListItem)
  });
  port.postMessage(JSON.stringify({
    type: 'fetchMatchers'
  }));
  document.getElementById('form').addEventListener('submit', postMessageAndAddListItem)
}
