const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const database = ["PoWeR_TIG_2200", "GKM_250", "RKM_800"];

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
	enum Size {
		Large
		Medium
		Small
	}
	type Link {
		name: String
		address: String
		size: Size
	}
	type Query {
		images: [String]
		links(name: String, sizes: [Size]): [Link]
		link(name: String, size: Size): String
		addImage(name: String): String
	}
`);

// The root provides a resolver function for each API endpoint
const rootValue = {
	images: () => database,
	links: ({ name, sizes }) => {
		const list = [];

		for (const size of sizes) {
			list.push({
				address: `cdn.gedik.com/${name}_${size}.jpg`,
				size,
				name,
			});
		}

		return list;
	},
	link: ({ name, size }) => {
		return `cdn.gedik.com/${name}_${size}.jpg`;
	},
	addImage: ({ name }) => {
		if (database.includes(name)) {
			throw new Error("Already Exists!");
		} else {
			database.push(name);
		}

		return name;
	},
};

const app = express();
app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		rootValue,
		graphiql: true,
	})
);

app.listen(4000);
console.log("http://localhost:4000/graphql");
