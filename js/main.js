


const config = {

    top: 10,
    right: 100,
   bottom: 10,
    left: 100,

}

var width;
var height;
//set width and height based on screen size
window.innerWidth > 700 ? width = window.innerWidth -config.right - config.left : width = 600 -config.left - config.right;
height = window.innerHeight;
height = 500;


const lineScaleX = d3.scaleLinear().domain([0, 2000000 ]).range([0,width-config.left -config.right-80])
const lineScaleY = d3.scaleLinear().domain([0,.7 ]).range([ height-20,0])

const barScaleYPos = d3.scaleLinear().domain([0,.5 ]).range([0,100])
const barScaleYNeg = d3.scaleLinear().domain([0,-.5 ]).range([0,100])



const lineSvg = d3.select('#line').append('svg').attr("height", height).attr("width", width).attr('class', "svgBg")




d3.csv("dataSrc/acLevelGather.csv", function(lineData){



lineData.forEach(function (d){

d.amount = +d.amount
d.level = +d.level

})




// console.table(lineData)

lineData = lineData.filter(d=> d.level <=4000000)


const lineGenerator =  d3.line()
                    .x(d=> lineScaleX(d.level))
                    .y(d=>lineScaleY(d.amount))
                    // .curve(d3.curveNatural) 
                    // .curve(d3.curveLinear) 
                    // .curve(d3.curveBundle) 
                    // .curve(d3.curveStepBefore) 
                    .curve(d3.curveStep) 

// musherList.forEach(function (d, i){  
        
//     const mush = lineData.filter(j=> j.musher == d );
//     svgLine.append("path")
//     .datum(mush)
//     .attr("d", lineGenerator)
//     .attr("class", "line")
//     .attr("id", q=>`_${d.replace(" ","").replace(" ","")}`)
// }

const firms = lineData.map(d=> d.firm)
const unqFirms = new Set (firms)



var toolTip1 = d3.select('#line').append("div")
.attr("id", "toolTip")
.attr("class", "toolTip")
.style("opacity", 0);



const axisTop = d3.axisTop(lineScaleX).tickValues([1,1000, 500000, 1000000, 2000000, 3000000]).tickFormat(d3.format(".0s"));
const axisLeft = d3.axisLeft(lineScaleY).tickValues([0,.25,.35, .45, .6])

lineSvg.append('g')
.attr("transform", "translate(50,23)")
.attr('class', "axisClass")
    .call(axisTop)
    .select(".domain").remove()


    lineSvg.append('g')
    .attr("transform", "translate(50,0)")
    .attr('class', "axisClass")
        .call(axisLeft)
        .select(".domain").remove()
    



// const barSvg = toolTip1.append('svg').attr("height", 200).attr("width", 200).attr('fill', 'rgba(255,255,255.6)')


unqFirms.forEach(function (firm){

    const firmData = lineData.filter(d=> d.firm == firm )
    
    
  lineSvg.append('path')
    .datum(firmData)
    .attr("d", lineGenerator)
    .attr("class", "line")
    .attr("id", q=>`_${firm.replace(" ","").replace(" ","")}`)
    .attr("transform", "translate(50,0)")

// const currentPath = lineSvg.select(`#_${firm.replace(" ","").replace(" ","")}`)

    // var l1 = currentPath.node().getTotalLength();
// console.log(l1)
    // currentPath.attr('stroke-dasharray', `${l1} ${l1}`)
    // .attr('stroke-dashoffset', l1)
    // .style("opacity", 0 )

    //       .transition()
    //         //   .delay(l1/2)
    //           .duration(l1*6)
    //            .style("opacity", 1)
    //           .attr('stroke-dashoffset', 0)
    



    // lineSvg.append('path')
    // .datum(firmData)
    // .attr("d", lineGenerator)
    // // .attr("class", "lineClear")
    // .attr("id", q=>`_${firm.replace(" ","").replace(" ","")}`)


    




   .on("mouseover", function(d) {		
       
       lineSvg.selectAll('path')
        .attr('class', "lineFade")

       
    
        // .attr("class", "lineClear")
const currentFirm = this.getAttribute('id').slice(1,5);
console.log(currentFirm);


d3.select(this)
.attr("class", "lineSelect")





// d3.select("div#toolTip")
// .style("left", ()=>d3.select(this).attr("cx"))
toolTip1.style("top", ()=>(`${d3.event.pageY+10}px`))
// .style("display", "absolute")
 .style("left", ()=>(`${d3.event.pageX}px`))
// .transition()
//  .duration(300) // ms
 .style("opacity", 1); 






// var l1 = this.getTotalLength();

// d3.select(this).attr('stroke-dasharray', `${l1} ${l1}`)
// .attr('stroke-dashoffset', l1)

//       .transition()
//           .delay(0)
//           .duration(2000)
//         //    .style("opacity", 1)
//           .attr('stroke-dashoffset', 0)

   






const barData = lineData.filter(d=> d.firm == currentFirm )

console.log(barData)






        lineSvg.selectAll('rect')
        .data(barData)
        .enter()
        .append('rect')
        .attr("x", (d,i)=> lineScaleX(d.level))
        .attr("x", (d,i)=> i*6+0)
        .attr("y", d=> d.diffMedian >0 ? 100 - barScaleYPos(d.diffMedian): 100)
        .attr("width", 5)
        .attr("height", 0)
        .transition()
        .duration(300)
        .attr("height", d=> d.diffMedian >0 ? barScaleYPos(d.diffMedian): barScaleYNeg(d.diffMedian))
        // .attr("r", 3)
        .attr('opacity', .9)
        .attr('fill', d=> d.diffMedian <   0 ? 'rgb(213, 50, 21)' :"rgb(47, 210, 155)")
    
    
    

        // lineSvg.selectAll('circle')
        // .data(barData.filter((d,i)=> i%2!=0))
        // .enter()
        // .append('circle')
        // .attr("cx", d=> lineScaleX(d.level))
        // .attr("cy", d=> lineScaleY(d.amount))
        // .attr("r",2 )
        // .attr('class', 'circle')
        // // .attr('opacity', .8)
        // // .attr('fill', 'rgba(0,0,0,.5')
        // // .attr('fill', 'rgba(255, 255, 255, 1')
        // .attr('stroke-width', 1)
        // .attr('stroke', "whitesmoke")
        // // .attr('stroke', "#333")
        // .attr('stroke', "lightblue")
        






        }).on("mouseout", function(d) {		
        d3.select(this)
         .attr("class", "line")


         lineSvg.selectAll('path')
         .attr('class', "line")



         toolTip1.style("opacity", 0);



         lineSvg.selectAll('rect')
    //      .transition()
    //      .duration(30)
    //  .attr("height", 0)
     
        .remove()
         
        lineSvg.selectAll('circle')
      

         })								



})




// const sel = lineSvg.select("#_AT1").attr("class", "lineSelect")
// const sel1 = lineSvg.select("#_PR3").attr("class", "lineSelect")
// const sel2 = lineSvg.select("#_W").attr("class", "lineSelect")


////the dot


const dotSvg = d3.select('#dot').append('svg').attr("height", height).attr("width", width)




///////the bar



// const barSvg = d3.select('#bar').append('svg').attr("height", height).attr("width", width)
// const barSvg = d3.select('#toolTip').append('svg').attr("height", 200).attr("width", 300)

// barSvg.selectAll('rect')
//     .data(lineData)
//     .enter()
//     .append('rect')
//     .attr("x", d=> lineScaleX(d.level))
//     .attr("y", d=> lineScaleY(d.amount))
//     .attr("width", 14)
//     .attr("height", d=> lineScaleY(d.amount))
//     // .attr("r", 3)
//     .attr('opacity', .2)
//     .attr('fill', 'salmon')




})//d3.csv

