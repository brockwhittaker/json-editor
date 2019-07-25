import React from "react"
import ReactDOM from "react-dom"
import "./index.css"

const block = {
	x: [{test: "a"}],
	id: "8947b61f-4386-4ead-ab52-00200a446140",
	version: 650,
	type: "page",
	properties: {
		LkiV: [["In Progress"]],
		"%7%.": [["High Leverage"]],
		")fY@": [["6"]],
		'99x"': [["‣", [["u", "7c74a801-7cb5-4914-bbbe-2b18cd1ced76"]]]],
		"<fJl": [
			["‣", [["p", "2cb64ff2-4399-4346-8d71-e8f0b4de1964"]]],
			[","],
			["‣", [["p", "4c70bf79-0c75-4caf-8d97-9d83388db374"]]],
			[","],
			["‣", [["p", "4fccf201-b601-4daf-9a1d-0b8e6092533a"]]],
			[","],
			["‣", [["p", "617bb3f1-273e-4013-83ba-c1d684dcb718"]]],
			[","],
			["‣", [["p", "6bf3bb93-ea63-4a67-aa14-fb1a96319df0"]]],
			[","],
			["‣", [["p", "d1717ca6-4e21-4f61-83da-ca21fd94c454"]]],
		],
		"SFZ/": [
			[
				"‣",
				[
					[
						"d",
						{
							type: "daterange",
							end_date: "2019-07-22",
							start_date: "2019-07-04",
						},
					],
				],
			],
		],
		"iz@s": [["⭐️⭐️"]],
		jRZk: [["Integration,Scale"]],
		title: [["API & Integrations"]],
	},
	content: [
		"9daa89ef-29ac-495d-8963-50efd7f2abb6",
		"8359066b-28da-46a3-bebc-7b6c01124ed6",
		"8a2f32b3-3527-4211-9f18-a13410e137d4",
	],
	created_by: "4b723c12-e06d-4354-9951-aef27cabf6f1",
	created_time: 1535323282085,
	last_edited_by: "7c74a801-7cb5-4914-bbbe-2b18cd1ced76",
	last_edited_time: 1563929940000,
	parent_id: "c91b8f67-c73b-41c4-a0a8-95a9faa0a98d",
	parent_table: "collection",
	alive: true,
};

let updated_block = block;

// allow for us to call the trigger function from anywhere globally
// to re-render in the main component with a new value.
let GlobalEventBusListener = (() => {
	let callback;
	return {
		trigger: (value) => {
			if (callback) callback(value);
		},
		callback: (cb) => {
			callback = cb;
		}
	}
})();

class RenderValue extends React.Component {
	constructor (value) {
		super();

		this.state = {

		};
	}

	componentDidMount () {
		this.setState({ value: this.props.value });
	}

	render () {
		let is_string = typeof this.props.value === "string";
		if (is_string) {
			return (
				<span className="value value--string">"
					<span contentEditable="true" onBlur={e => this.props.handleChange(e.target.innerText)}>{this.props.value}</span>
				"</span>
			)
		} else {
			return (
				<span className="value value--primitive">{<span contentEditable="true" onBlur={e => this.props.handleChange(e.target.innerText)}>{this.props.value + ""}</span>}</span>
			)
		}
	}
}

class RenderArray extends React.Component {
	constructor (array) {
		super();

		this.state = {
			show: false,
		}
	}

	render () {
		// if not opened, don't display it, since we don't want to overload the DOM
		// with unecessary nodes to render.
		if (!this.state.show) return (
			<>
				<span className="toggle-down" onClick={() => this.setState({ show: true })}>▶</span>
				<span className="array">...</span>
			</>
		);
		return (
			<div className="array">
				<span className="toggle-up" onClick={() => this.setState({ show: false })}>▼</span>
				{this.props.array.map((elem, idx) => {
					return returnCorrectObject(null, elem, this.props.array, idx, this.props.chain.concat([idx]))
				})}
			</div>
		);
	}
}

class RenderObject extends React.Component {
	constructor (obj) {
		super();
		this.state = {
			show: false,
		}
	}

	render () {
		// if not opened, don't display it, since we don't want to overload the DOM
		// with unecessary nodes to render.
		if (!this.state.show) return (
			<>
				<span className="toggle-down" onClick={() => this.setState({ show: true })}>▶</span>
				<span className="object">...</span>
			</>
		);

		return (
			<div className="object">
				<span className="toggle-up" onClick={() => this.setState({ show: false })}>▼</span>
			{
				Object.keys(this.props.object).map(o => {
					return (
						<span className="value">{ returnCorrectObject(o, this.props.object[o], this.props.object, o, this.props.chain.concat([o])) }</span>
					)
					return o;
				})
			}
			</div>
		)
	}
}

class RenderJSON extends React.Component {
	constructor () {
		super();
	}

	render () {
		return returnCorrectObject(null, this.props.json, null, null, []);
	}
}

const returnCorrectObject = (key, data, parent, idx, chain) => {
	// this will essentially traverse the path of the entire object, creating
	// a new copy where required for react to understand how to re-update the DOM.
	// we then call the `GlobalEventBusListener` to trigger a state update with
	// the new value rather than using some series of props...
	let handleChange = value => {
		if (!Number.isNaN(parseFloat(value))) value = parseFloat(value);
		if (value === "true") value = true;
		if (value === "false") value = false;

		let o_p = updated_block;
		let new_block = {...updated_block};
		let n_p = new_block;
		// traverse the object like [['test'],[0],['key'],['something']] => obj['test'][0]['key']['something']
		// and then set the value on the last step (in else).
		for (let x = 0; x < chain.length; x++) {
			if (x !== chain.length - 1) {
				n_p[chain[x]] = (Array.isArray(o_p[chain[x]])) ? [...o_p[chain[x]]] : n_p[chain[x]] = {...o_p[chain[x]]};
				n_p = n_p[chain[x]];
				o_p = o_p[chain[x]];
			} else {
				n_p[chain[x]] = value;
			}
		}

		// make call to update master state.
		GlobalEventBusListener.trigger(new_block);
	};

	// create the key fragment that will either look like `key: ` or ``.
	// make sure to escape any `"` in the key so that when we stringify it works.
	let Key = key ? <><span className="key">"{key.replace(/\"/g, '\\"')}"</span>:&nbsp;</> : <></>;
	if (Array.isArray(data)) {
		return (
			<div class="level">
				<span className="key-line">{Key}{"["}</span>
					<RenderArray array={data} handleChange={handleChange} chain={chain} />
				<span>{"],"}</span>
			</div>
		)
	} else if (typeof data === "object" && data !== null) {
		return (
			<div class="level">
				<span className="key-line">{Key}{"{"}</span>
					<RenderObject object={data} handleChange={handleChange} chain={chain} />
				<span>{"},"}</span>
			</div>
		)
	} else {
		return (
			<div class="level">
				<span className="key-line">{Key}</span>
				<RenderValue value={data} handleChange={handleChange} chain={chain} />,
			</div>
		)
	}
};

class App extends React.PureComponent {
	constructor () {
		super();
		this.state = {
			block,
		};
	}

	render() {
		GlobalEventBusListener.callback((value) => {
			this.setState({ block: value });
			// update to new source of truth.
			updated_block = value;
		});

		return (
			<>
			<code className="display-json" style={{ whiteSpace: "pre" }}>
				<RenderJSON json={this.state.block} />
			</code>
			<code className="proof" data-name="updated" style={{ whiteSpace: "pre" }}>
				{JSON.stringify(updated_block, null, 4)}
			</code>
			<code className="proof" data-name="original" style={{ whiteSpace: "pre" }}>
				{JSON.stringify(block, null, 4)}
			</code>
			</>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("root"))
