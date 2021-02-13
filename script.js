const colorRange = ["#f7fbff", "#f6faff", "#f5fafe", "#f5f9fe", "#f4f9fe", "#f3f8fe", "#f2f8fd", "#f2f7fd", "#f1f7fd", "#f0f6fd", "#eff6fc", "#eef5fc", "#eef5fc", "#dae8f6", "#d9e8f5", "#d9e7f5", "#d8e7f5", "#d7e6f5", "#d6e6f4", "#d6e5f4", "#d5e5f4", "#d4e4f4", "#d3e4f3", "#d2e3f3", "#d2e3f3", "#d1e2f3", "#d0e2f2", "#cfe1f2", "#cee1f2", "#cde0f1", "#cce0f1", "#ccdff1", "#cbdff1", "#cadef0", "#c9def0", "#c8ddf0", "#c7ddef", "#c6dcef", "#c5dcef", "#c4dbee", "#c3dbee", "#c2daee", "#c1daed", "#c0d9ed", "#bfd9ec", "#bed8ec", "#bdd8ec", "#bcd7eb", "#bbd7eb", "#b9d6eb", "#b8d5ea", "#b7d5ea", "#b6d4e9", "#b5d4e9", "#b4d3e9", "#b2d3e8", "#b1d2e8", "#b0d1e7", "#afd1e7", "#add0e7", "#acd0e6", "#abcfe6", "#a9cfe5", "#a8cee5", "#a7cde5", "#a5cde4", "#a4cce4", "#a3cbe3", "#a1cbe3", "#a0cae3", "#9ec9e2", "#9dc9e2", "#9cc8e1", "#9ac7e1", "#99c6e1", "#97c6e0", "#96c5e0", "#94c4df", "#93c3df", "#91c3df", "#90c2de", "#8ec1de", "#8dc0de", "#8bc0dd", "#8abfdd", "#88bedc", "#87bddc", "#85bcdc", "#84bbdb", "#82bbdb", "#81badb", "#7fb9da", "#7eb8da", "#7cb7d9", "#7bb6d9", "#79b5d9", "#78b5d8", "#76b4d8", "#75b3d7", "#73b2d7", "#72b1d7", "#70b0d6", "#6fafd6", "#6daed5", "#6caed5", "#6badd5", "#69acd4", "#68abd4", "#66aad3", "#65a9d3", "#63a8d2", "#62a7d2", "#61a7d1", "#5fa6d1", "#5ea5d0", "#5da4d0", "#5ba3d0", "#5aa2cf", "#59a1cf", "#57a0ce", "#569fce", "#559ecd", "#549ecd", "#0d539a", "#0d5299", "#0c5198", "#0c5097", "#0b4f96", "#0b4e95", "#0b4d93", "#0b4c92", "#0a4b91", "#0a4a90", "#0a498e", "#0a488d", "#09478c", "#09468a", "#094589", "#094487", "#094386", "#094285", "#094183", "#084082", "#083e80", "#083d7f", "#083c7d", "#083b7c", "#083a7a", "#083979", "#083877", "#083776", "#083674", "#083573", "#083471", "#083370", "#08326e", "#08316d", "#08306b"]

const colors = [
    "#f5f9fe",
    "#d0e2f2",
    "#c2daee",
    "#8ec1de",
    "#87bddc",
    "#78b5d8",
    "#62a7d2",
    "#559ecd",
    "#09468a",
    "#08316d",
]

let countyData
let educationData
const tooltip = d3.select('#map-id')
    .append("div")
    .style('opacity', 1)
    .attr('id', 'tooltip')


const path = d3.geoPath()
const usEducationDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const usCountyDataURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

d3.json(usCountyDataURL)
    .then((data, error) => {
        if (error) {
            throw new Error('Could not fetch Data')
        }
        else {
            countyData = topojson.feature(data, data.objects.counties).features
            d3.json(usEducationDataURL)
                .then((data, error) => {
                    if (error) {
                        throw new Error('Could not fetch Data')
                    }
                    else {
                        educationData = data
                        const bachelorRate = educationData.map(d => d.bachelorsOrHigher)

                        const colorScale = d3.scaleOrdinal()
                            .domain([d3.min(bachelorRate),
                            d3.max(bachelorRate)
                            ])
                            .range(colorRange)

                        d3.select('#svg')
                            .selectAll('path')
                            .data(countyData)
                            .enter()
                            .append('path')
                            .attr('d', path)
                            .attr('class', 'county')
                            .attr('fill', (d) => {
                                var res = educationData.filter(a => a.fips === d.id)
                                if (res[0]) {
                                    return colorScale(res[0].bachelorsOrHigher)
                                }
                            })
                            .attr('data-fips', (d) => d.id)
                            .attr('data-education', (d) => {
                                var res = educationData.filter(a => a.fips === d.id)
                                return res[0].bachelorsOrHigher
                            })

                            .on('mouseover', (d, i) => {
                                var res = educationData.filter(a => a.fips === i.id)

                                tooltip.style('opacity', 1)
                                tooltip.html(
                                    res[0].area_name + ', ' + res[0].state + "<br>" + "Education Rate: " + res[0].bachelorsOrHigher + "%"
                                )
                                tooltip.attr('data-education', (d) => {
                                    var res = educationData.filter(a => a.fips === i.id)
                                    return res[0].bachelorsOrHigher
                                })

                                onmousemove = function (e) {
                                    tooltip
                                        .style('left', `${e.clientX + 20}px`)
                                        .style('top', `${e.clientY - 50}px`)
                                }
                            })
                            .on('mouseout', () => {
                                tooltip.style('opacity', 0)
                            })
                            .attr('transform', `scale(${0.9})`)

                        const legendWidth = 200
                        const legendHeight = 20

                        const legend = d3.select('#legend')
                            .append('svg')
                            .attr('class', 'legend-svg')
                            .attr('width', legendWidth)
                            .attr('height', legendHeight)
                            .selectAll('rect')
                            .data(colors)
                            .enter()
                            .append('rect')
                            .attr('x', (d, i) => i * (legendWidth / colors.length))
                            .attr('y', 0)
                            .attr('width', legendWidth / colors.length)
                            .attr('height', legendHeight)
                            .attr('fill', (d) => d)
                            .append('text')
                            .text('asd')
                    }
                })
        }
    })
