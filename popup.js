var port = chrome.extension.connect({
  name: "Sample Communication"
});

function handleChange(event) {
  port.postMessage(event.target.value);
}

window.onload = () => {
  document.getElementById('form').addEventListener('submit', (event) => {
    event.preventDefault();
    port.postMessage(document.getElementById('myInput').value);
    const li = document.createElement('li');
    let t = document.createTextNode(document.getElementById('myInput').value);       // Create a text node
    li.appendChild(t);                                // Append the text to <button>
    document.getElementById('list').appendChild(li);
  })
}
