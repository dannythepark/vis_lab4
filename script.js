d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
	console.log("WealthHealth", data);
    Data = data

    const margin = {top:20, left:20, bottom:20, right:20};
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    const svg = d3.select('.chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate('+margin.left+','+margin.right+')')
        
    const xScale = d3.scaleLinear()
        .domain(d3.extent(Data.map(function(d){
            return(d.Income);
        })))
        .range([0,width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(Data.map(function(d){
            return(d.LifeExpectancy);
        })))
        .range([height,0]);
    
    svg.selectAll("circle")
        .data(Data)
        .enter()
        .append('circle')
        .attr("fill", d => colorScale(d.Region))
        .attr("fill-opacity","0.8")
        .attr('stroke','black')
        .attr('cx', d=>xScale(d.Income))
        .attr('cy', d=>yScale(d.LifeExpectancy))
        .attr("r", function(d){
            if (d.Population > 1000000000){
                return 22;
            }
            else if (d.Population > 500000000){
                return 14;
            }
            else if(d.Population > 100000000){
                return 12;
            }
            else if (d.Population > 10000000){
                return 10;
            }
            else if (d.Population > 1,000,000){
                return 8;
            }
            else {
                return 6;
            }
        })
        .on("mouseover", (event, d) => {
        const pos = d3.pointer(event, window)
        d3.select('.tooltip')
            .style("opacity", 0.9)
            .style("display","block")
            .style("left", (pos[0] + 5 + "px"))
            .style("top", (pos[1] + 5 + "px"))
            .html(`Country:  ${d.Country} <br> Region: ${d.Region} <br> Population: ${d3.format(",")(d.Population)} <br> Income:  ${d3.format("$,")(d.Income)} <br> Life Expectancy:  ${d.LifeExpectancy} `);
         })
        .on("mouseout", (event, d) => {
           d3.select('.tooltip')
            .style("display","none")
            .style("opacity", 0)
        });
     
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5,'s');

    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(5,'s');

    svg.append('g')
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);
   
    svg.append('g')
        .attr("class", "axis y-axis")
        .call(yAxis);

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 10)
        .text("Income");

    svg.append("text")
        .attr("class", "y label")
        .attr("x", - margin.left)
        .attr("y", -2)
        .attr("text-anchor", "start")
        .text("Life expectancy");

    var legendRectSize = 15;                                  
    var legendSpacing = 3;  
        const legend = svg.selectAll('.legend')                     
        .data(colorScale.domain())                                   
        .enter()                                                
        .append('g')                                            
        .attr('class', 'legend')
        .attr('transform', function(d, i) {                     
              var height = legendRectSize + legendSpacing;          
              var offset =  height * colorScale.domain().length - 70;     
              var horz = -2 * legendRectSize + 430;                       
              var vert = i * height - offset + 350;                       
              return 'translate(' + horz + ',' + vert + ')';        
            });        

        legend.append('rect')
          .attr('width', legendRectSize)     
          .attr('height', legendRectSize)           
          .style('fill', colorScale) 

        legend.append('text')
          .attr('x', legendRectSize + 4)
          .attr('y', legendRectSize - 3)
          .attr('font-size',12)
          .text(function(d){ return d;});

});