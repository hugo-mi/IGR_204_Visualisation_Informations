// Global variable
const w = 600; 
const h = 600;
let dataset = [];

//Create SVG element
let svg = d3.select("body")
            .append("svg") 
                .attr("width", w) 
                .attr("height", h);

// Draw the map of france
function draw() { 
    svg.selectAll("rect")
        .data(dataset) 
        .enter() 
        .append("circle") 
        .attr("fill", (d) => color(d.population))        
        .attr("r", (d) => size(d.density))
        .attr("cx", (d) => x(d.longitude)) 
        .attr("cy", (d) => y(d.latitude))
        
}

function displayname(){
    d3.selectAll("circle")
        .data(dataset)

        .on("mouseover", (d, i) => {
            console.log(d.currentTarget.__data__.place);
            console.log(d.currentTarget.__data__.codePostal);

            d3.selectAll(".city")
                .text('City: ' + d.currentTarget.__data__.place)

            d3.selectAll(".postalCode")
                .text('Postal Code: ' + d.currentTarget.__data__.codePostal)

            d3.selectAll(".population")
                .text('Population: ' + d.currentTarget.__data__.population)

            d3.selectAll(".density")
                .text('Density: ' + d.currentTarget.__data__.density)

        });
    }

// Load dataset
d3.tsv("data/france.tsv", (d, i) => { 
        return {
            codePostal: +d["Postal Code"], 
            inseeCode: +d.inseecode, 
            place: d.place,
            longitude: +d.x,
            latitude: +d.y, 
            population: +d.population, 
            density: +d.density
        };
    })
    .then((rows) => {
        // Do something when the dataset is loaded
        dataset = rows;

        x = d3.scaleLinear()
                .domain(d3.extent(rows, (row) => row.longitude)) 
                .range([0, w]);
        
        y = d3.scaleLinear()
                .domain(d3.extent(rows, (row) => row.latitude)) 
                .range([h, 0]);

        size = d3.scaleSqrt()
                .domain(d3.extent(rows, (row) => row.density)) 
                .range([0.5, 20]);

        color = d3.scaleSqrt()
                .domain(d3.extent(rows, (row) => row.population)) 
                .range([d3.rgb(176, 230, 120), d3.rgb(42, 72, 88)]);


        // Display the map        
        draw();
        
        // Display the name of the city
        displayname();

        // Add x_axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + h + ")") .call(d3.axisTop(x))
        
        // Add y_axis
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0, " + 0 + ")") .call(d3.axisRight(y))

        console.log(`Loaded ${rows.length} rows.`);
        if (rows.length > 0) {
            console.log("First row: ", rows[0]);
            console.log("Last row: ", rows[rows.length-1])
        ;}

    }).catch( (error) => {
        // display errors in the browser console
        console.log("Something went wrong", error);
    })
