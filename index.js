const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const database = ["PoWeR_TIG_2200", "GKM_250", "RKM_800"];

// Endpoints and Types
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
		# Get All Images in the Database
		images: [String]

		# Get Multiple Sizes of an Image
		links(name: String, sizes: [Size]): [Link]

		# Get One Size of an Image
		link(name: String, size: Size): String

		# Add A New Image Entry
		addImage(name: String): String
	}
`);

// What Each Endpoint Does
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

// Serve with Express
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
