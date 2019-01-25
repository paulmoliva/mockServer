import React from 'react';
import { clone } from 'ramda';
import * as ReactDOM from 'react-dom';


class MockServerExtension extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchers: {},
      matchInput: '',
      newPairForm: [{
        key: '',
        value: '',
      }]
    };
    this.port = chrome.extension.connect({
      name: "Sample Communication"
    });
    this.postMessageAndAddListItem = this.postMessageAndAddListItem.bind(this);
    this.handleMatcherInputChange = this.handleMatcherInputChange.bind(this);
    this.handlePairKeyChange = this.handlePairKeyChange.bind(this);
    this.handlePairValueChange = this.handlePairValueChange.bind(this);
    this.handleNewPairKeyChange = this.handleNewPairKeyChange.bind(this);
    this.handleNewPairValueChange = this.handleNewPairValueChange.bind(this);
    this.addPair = this.addPair.bind(this);
    this.syncMatchers = this.syncMatchers.bind(this);
    this.handleStatusCodeChange = this.handleStatusCodeChange.bind(this);
  }

  componentDidMount() {
    this.syncMatchers();
  }

  syncMatchers() {
    this.port.onMessage.addListener((msg) => {
      const matchers = JSON.parse(msg);
      console.log(matchers)
      this.setState({
        matchers,
      })
    });
    this.port.postMessage(JSON.stringify({
      type: 'fetchMatchers',
    }));
  }

  handleStatusCodeChange(key, e) {
    const { value } = e.target;
    this.setState({
      matchers: {
        ...this.state.matchers,
        [key]: {
          ...this.state.matchers[key],
          statusCode: value,
        }
      }
    })
    this.port.postMessage(JSON.stringify({
      type: 'updateStatusCode',
      key,
      payload: value,
    }));
  }

  handleMatcherInputChange(e) {
    const { value } = e.target;
    this.setState({
      matchInput: value,
    });
  }

  handlePairKeyChange(key, i, e) {
    const newPairs = clone(this.state.matchers[key].responseKVPairs);
    newPairs.key = e.target.value;
    this.setState({
      matchers: {
        ...this.state.matchers,
        [key]: {
          ...this.state.matchers[key],
          responseKVPairs: newPairs,
        }
      }
    })
  }

  handlePairValueChange(key, i, e) {
    const newPairs = clone(this.state.matchers[key].responseKVPairs);
    newPairs.value = e.target.value;
    this.setState({
      matchers: {
        ...this.state.matchers,
        [key]: {
          ...this.state.matchers[key],
          responseKVPairs: newPairs,
        }
      }
    })
  }

  handleNewPairKeyChange(e) {
    const { value } = e.target;
    this.setState({
      newPairForm: {
        ...this.state.newPairForm,
        key: value,
      }
    })
  }

  handleNewPairValueChange(e) {
    const { value } = e.target;
    this.setState({
      newPairForm: {
        ...this.state.newPairForm,
        value: value,
      }
    })
  }

  addPair(matchKey) {
    console.log(matchKey, this.state)
    const newPairs = clone(this.state.matchers[matchKey].responseKVPairs);
    const { key, value } = this.state.newPairForm;
    newPairs.push({ key, value });
    this.setState({
      matchers: {
        ...this.state.matchers,
        [matchKey]: {
          ...this.state.matchers[matchKey],
          responseKVPairs: newPairs,
        }
      },
      newPairForm: {
        key: '',
        value: '',
      }
    });
    this.port.postMessage(JSON.stringify({
      type: 'addResponseKVPair',
      key: matchKey,
      payload: { key, value }
    }));
  }

  postMessageAndAddListItem(event) {
    event.preventDefault();
    const value = this.state.matchInput;
    this.setState({
      matchers: {
        ...this.state.matchers,
        [value]: {
          statusCode: 422,
          responseKVPairs: [],
        }
      }
    })
    this.port.postMessage(JSON.stringify({
      type: 'addMatcher',
      key: value,
    }));
  }

  render() {
    const matcherKeys = Object.keys(this.state.matchers);
    return (
      <div>
        <form id="form" onSubmit={this.postMessageAndAddListItem}>
        <input
          onChange={this.handleMatcherInputChange}
          type="text"
          id="myInput"
          value={this.state.matchInput}
          placeholder="Any requests containing this string will error."
        />
        </form>
        <ul id="list">
          {matcherKeys.map(key => (
            <li key={key}>
              <p>{key}</p>
              <input type="number" value={this.state.matchers[key].statusCode} onChange={this.handleStatusCodeChange.bind(null, key)} placeholder="Status Code (ie 422)" />
              {this.state.matchers[key].responseKVPairs.map((pair, i) => (
                <div>
                  <input value={pair.key} onChange={this.handlePairKeyChange.bind(null, key, i)} />
                  <input value={pair.value} onChange={this.handlePairValueChange.bind(null, key, i)}/>
                </div>
              ))}
              <div>
                <input value={this.state.newPairForm.key} onChange={this.handleNewPairKeyChange} />
                <input value={this.state.newPairForm.value} onChange={this.handleNewPairValueChange}/>
                <button onClick={this.addPair.bind(null, key)}>Add Pair</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

window.onload = () => {
  ReactDOM.render(<MockServerExtension/>, document.getElementById('root'))
}

// function handleChange(event) {
//   this.port.postMessage(event.target.value);
// }
//
// function createInputElement(placeholder, type, value, onChange) {
//   const input = document.createElement('input');
//   input.placeholder = placeholder;
//   input.type = type;
//   input.value = value;
//   input.addEventListener('change', onChange)
//   return input;
// }

// function createStatusInput(value, parent) {
//   const postStatusCodeUpdate = e => {
//     port.postMessage(JSON.stringify({
//       type: 'updateStatusCode',
//       key: value,
//       payload: e.target.value,
//     }))
//   };
//   const statusInput = createInputElement(
//     'Status Code',
//     'number',
//     422,
//     postStatusCodeUpdate,
//   );
//   parent.appendChild(statusInput);
// }

// function createResponsePair(parent) {
//   const keyInput = createInputElement(
//     'key',
//     'text',
//     '',
//     () => {},
//   );
//   const valueInput = createInputElement(
//     'value',
//     'text',
//     '',
//     () => {},
//   );
//   parent.appendChild(keyInput)
//   parent.appendChild(valueInput)
// }

// function addListItem(value) {
//   const li = document.createElement('li');
//   let t = document.createTextNode(value);
//   li.appendChild(t);
//   li.id = value;
//   const btn = document.createElement('button');
//   t = document.createTextNode(`remove ${value}`);
//   btn.appendChild(t);
//   btn.id = `remove-${value}`;
//   li.appendChild(btn);
//   document.getElementById('list').appendChild(li);
//   btn.addEventListener('click', () => {
//     btn.parentNode.parentNode.removeChild(li);
//     port.postMessage(JSON.stringify({
//       type: 'removeMatcher',
//       key: value,
//     }));
//   });
//   createStatusInput(value, li);
//   createResponsePair(li)
// }



// window.onload = () => {
//   port.onMessage.addListener(function(msg) {
//     const matchers = JSON.parse(msg);
//     matchers.forEach(addListItem)
//   });
//   port.postMessage(JSON.stringify({
//     type: 'fetchMatchers'
//   }));
//   document.getElementById('form').addEventListener('submit', postMessageAndAddListItem)
// }
