


const config = {

    top: 10,
    right: 30,
   bottom: 10,
    left: 30,

}

var width;
var height;
//set width and height based on screen size
window.innerWidth > 700 ? width = window.innerWidth -config.right - config.left : width = 400;
height = window.innerHeight;
// height = 500;


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
.style("opacity", 1);



const axisTop = d3.axisTop(lineScaleX).tickValues([1,1000, 500000, 1000000, 2000000, 3000000]).tickFormat(d3.format(".0s"));
const axisLeft = d3.axisLeft(lineScaleY).tickValues([0,.25,.35, .45, .6])

lineSvg.append('line')
    .attr("x1", lineScaleX(0))
    .attr("x2", lineScaleX(3000000))
    .attr("y1", lineScaleY(.5))
    .attr("y2", lineScaleY(.5))
    .attr('stroke', "gray")
    .attr("stroke-dasharray", "3 1")
    .attr("stroke-width", 1)

    // lineSvg.append('line')
    // .attr("x1", lineScaleX(100000))
    // .attr("x2", lineScaleX(3000000))
    // .attr("y1", lineScaleY(.1))
    // .attr("y2", lineScaleY(.1))
    // .attr('stroke', "salmon")
    // .attr("stroke-dasharray", "3 1")
    // .attr("stroke-width", 2)

    // lineSvg.append('line')
    // .attr("x1", lineScaleX(0))
    // .attr("x2", lineScaleX(3000000))
    // .attr("y1", lineScaleY(.25))
    // .attr("y2", lineScaleY(.25))
    // .attr('stroke', "salmon")
    // .attr("stroke-dasharray", "3 1")
    // .attr("stroke-width", 2)

    lineSvg.append('line')
    .attr("id", "hoverLine")
    .attr("x1", ()=>(`${0}px`))
    .attr("x2", ()=>(`${0}px`))
    .attr("y1", lineScaleY(0))
    .attr("y2", lineScaleY(.65))
    // .attr("stroke-dasharray", "3 1")
    .attr("stroke-width", 1)
    .attr("class", "clear")

    lineSvg.append('line')
    .attr("id", "hoverLineHor")
    .attr("x1", ()=>(lineScaleX(0)))
    .attr("x2", ()=>(lineScaleX(200000000)))
    .attr("y1", lineScaleY(0))
    .attr("y2", lineScaleY(0))
    // .attr("stroke-dasharray", "3 1")
    .attr("stroke-width", 1)
    .attr("class", "clear")







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


unqFirms.forEach(function (firm, index){

    const firmData = lineData.filter(d=> d.firm == firm )
    
    
    const currentPath =   lineSvg.append('path')
    .datum(firmData)
    .attr("d", lineGenerator)
    .attr("class", "line")
    .attr("id", q=>`_${firm.replace(" ","").replace(" ","")}`)
    .attr("transform", "translate(50,0)")
            //   .transition()
            //   .delay(100*index)
            //   .duration(200)



              const currentPathClear =   lineSvg.append('path')
              .datum(firmData)
              .attr("d", lineGenerator)
              .attr("class", "lineClear")
              .attr("id", q=>`_clear${firm.replace(" ","").replace(" ","")}`)
              .attr("transform", "translate(50,0)")
                


// const currentPath = lineSvg.select(`#_${firm.replace(" ","").replace(" ","")}`)



//     var l1 = currentPath.node().getTotalLength();
// console.log(l1)
//     currentPath.attr('stroke-dasharray', `${l1} ${l1}`)
//     .attr('stroke-dashoffset', l1)
//     .style("opacity", 1 )

//           .transition()
//               .delay(300)
//               .duration(12000)
//                .style("opacity", 1)
//               .attr('stroke-dashoffset', 0)
    



    // lineSvg.append('path')
    // .datum(firmData)
    // .attr("d", lineGenerator)
    // // .attr("class", "lineClear")
    // .attr("id", q=>`_${firm.replace(" ","").replace(" ","")}`)


    




   currentPathClear.on("mousemove", function(d) {		
       
       lineSvg.selectAll('path.line')
        .attr('class', "lineFade")


        // const currentFirm = this.getAttribute('id').slice(1,5);
        const currentFirm = this.getAttribute('id').slice(6,10);
console.log(currentFirm)
       console.log(currentFirm.length)
tt = document.querySelector('.toolTip')
tt.innerHTML = `<h3>${ currentFirm}</h3>`;
    
        // .attr("class", "lineClear")


d3.select(`path#_${currentFirm}`)
.attr("class", "lineSelect")



lineSvg.select("#hoverLine") 
.attr("x1", ()=>(`${d3.event.pageX-30}px`))
.attr("x2", ()=>(`${d3.event.pageX-30}px`))

.attr('class', "vis")


lineSvg.select("#hoverLineHor") 

.attr("y1", ()=>(`${d3.event.pageY}px`))
.attr("y2", ()=>(`${d3.event.pageY}px`))
.attr("stroke-width", 1)
.attr("class", "vis")








toolTip1.style("top", ()=>(`${d3.event.pageY-50}px`))
// .style("display", "absolute")
 .style("left", ()=>(`${d3.event.pageX+15}px`))
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
        // d3.select(this)
        //  .attr("class", "lineClear")


        const currentFirm = this.getAttribute('id').slice(6,10);

         d3.select(`path#_${currentFirm}`)
.attr("class", "line")

         lineSvg.selectAll('path.lineFade')
         .attr('class', "line")



         toolTip1.style("opacity", 0);

lineSvg.select('#hoverLine').attr("class", "clear");
lineSvg.select('#hoverLineHor').attr("class", "clear");

         lineSvg.selectAll('rect')
    //      .transition()
    //      .duration(30)
    //  .attr("height", 0)
     
        .remove()
         
        // lineSvg.selectAll('circle')
      

         })
         
//          .on("mousemove", function(d){
    
    


//             // d3.select("div#toolTip")
// // .style("left", ()=>d3.select(this).attr("cx"))
// toolTip1.style("top", ()=>(`${d3.event.pageY-50}px`))
// // .style("display", "absolute")
//  .style("left", ()=>(`${d3.event.pageX+15}px`))
// // .transition()
// //  .duration(300) // ms
//  .style("opacity", 1); 



//          }
         
//          )								



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

