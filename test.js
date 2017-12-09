const test = require('tape');
const React = require('React');
const Value = require('mutant/value');
const {withMutantProps} = require('./index');
const TestRenderer = require('react-test-renderer');

test('updates component state when mutant stream updates', t => {
  class Input extends React.Component {
      constructor(props) {
          super(props);
      }
    render() {
      return React.createElement('span', null, `My age is ${this.props.age}`);
    }
  }

  const Output = withMutantProps(Input, 'age');

  const obs = Value();
  obs.set(20);

  const elem = React.createElement(Output, {age: obs});
  const testRenderer = TestRenderer.create(elem);

  const result1 = testRenderer.toJSON();
  t.ok(result1, 'should have rendered');
  t.equal(result1.children.length, 1, 'should have one child');
  t.equal(result1.children[0], 'My age is 20', 'should show 20');

  obs.set(21);
  testRenderer.update(elem);

  const result2 = testRenderer.toJSON();
  t.ok(result2, 'should have rendered');
  t.equal(result2.children.length, 1, 'should have one child');
  t.equal(result2.children[0], 'My age is 21', 'should show 21');

  t.end();
});

test('supports many mutant streams', t => {
  class Input extends React.Component {
      constructor(props) {
          super(props);
      }
    render() {
      return React.createElement('span', null, `${this.props.lat},${this.props.lng}`);
    }
  }

  const Output = withMutantProps(Input, 'lat', 'lng');

  const lat = Value();
  const lng = Value();
  lat.set(45);
  lng.set(30);

  const elem = React.createElement(Output, {lat, lng});
  const testRenderer = TestRenderer.create(elem);

  const result1 = testRenderer.toJSON();
  t.ok(result1, 'should have rendered');
  t.equal(result1.children.length, 1, 'should have one child');
  t.equal(result1.children[0], '45,30', 'should show 45,30');

  lat.set(46);
  testRenderer.update(elem);

  const result2 = testRenderer.toJSON();
  t.ok(result2, 'should have rendered');
  t.equal(result2.children.length, 1, 'should have one child');
  t.equal(result2.children[0], '46,30', 'should show 46,30');

  lng.set(32);
  testRenderer.update(elem);

  const result3 = testRenderer.toJSON();
  t.ok(result3, 'should have rendered');
  t.equal(result3.children.length, 1, 'should have one child');
  t.equal(result3.children[0], '46,32', 'should show 46,32');

  t.end();
});

