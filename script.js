function App() {
  const [Data, setData] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data); // Salva i dati nello stato
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }

    fetchData();
  }, []);

  React.useEffect(() => {
    if (Data) {
      createScatterPlot(Data); 
    }
  }, [Data]); 

  return (
    <div>
      <h1>ScatterPlot</h1>
      
    </div>
  );
}

function createScatterPlot(data) {
  const w = 800;
  const h = 600;
  const padding = 60;

  const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Year), d3.max(data, d => d.Year)])
    .range([padding, w - padding]);

  const yScale = d3.scaleTime()
    .domain([d3.min(data, d => new Date(0, 0, 0, 0, d.Time.slice(0, 2), d.Time.slice(3, 5))),
      d3.max(data, d => new Date(0, 0, 0, 0, d.Time.slice(0, 2), d.Time.slice(3, 5)))])
    .range([h - padding, padding]);

  const svg = d3.select('#root')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // Titolo
  svg.append('text')
    .attr('id', 'title')
    .text('Doping in Professional Bicycle Racing')
    .attr('x', w / 2)
    .attr('y', padding / 2)
    .attr('text-anchor', 'middle');

  // Asse x
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis);

  // Asse y
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis);

  // punti
  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xScale(d.Year))
    .attr('cy', d => yScale(new Date(0, 0, 0, 0, d.Time.slice(0, 2), d.Time.slice(3, 5))))
    .attr('r', 5)
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => new Date(0, 0, 0, 0, d.Time.slice(0, 2), d.Time.slice(3, 5)))
    .style('fill', d => d.Doping.toLowerCase().includes('confessed') || d.Doping.toLowerCase().includes('admitted') ? 'red'
      : d.Doping ? 'yellow' : 'blue');
    
  // tooltip
  const tooltip = d3.select('#root')
    .append('div')
    .attr('id', 'tooltip');

  svg.selectAll('circle')
    .on('mouseover', function(event, d) {
      tooltip
        .html(`${d.Name} : ${d.Nationality}<br />
        Year: ${d.Year}, Time: ${d.Time}`)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 'px')
        .style('display', 'block')
        .attr('data-year', d.Year);
    })
    .on('mouseout', function() {
      tooltip
        .style('display', 'none');
    });

  // legenda
  d3.select('#root')
  .append('div')
  .attr('id', 'legend')
  .append('h2')
  .text('Legend:');
  d3.select('#legend')
  .append('svg')
  .attr('width', 300)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(20, 20)')
  .append(() => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 10);
    circle.setAttribute('cy', 10);
    circle.setAttribute('r', 6);
    circle.style.fill = 'red';
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    group.appendChild(circle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 26);
    text.setAttribute('y', 10);
    text.textContent = 'Confessed doping';
    text.style.fontSize = '15px';
    text.setAttribute('alignment-baseline', 'middle');
    group.appendChild(text);
    return group;
  })
  .append(() => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 10);
    circle.setAttribute('cy', 30);
    circle.setAttribute('r', 6);
    circle.style.fill = 'yellow';
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    group.appendChild(circle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 26);
    text.setAttribute('y', 30);
    text.textContent = 'Doping allegations';
    text.style.fontSize = '15px';
    text.setAttribute('alignment-baseline', 'middle');
    group.appendChild(text);
    return group;
  })
  .append(() => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', 10);
    circle.setAttribute('cy', 50);
    circle.setAttribute('r', 6);
    circle.style.fill = 'blue';
    circle.setAttribute('stroke', 'black');
    circle.setAttribute('stroke-width', 1);
    group.appendChild(circle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', 26);
    text.setAttribute('y', 50);
    text.textContent = 'No doping allegations';
    text.style.fontSize = '15px';
    text.setAttribute('alignment-baseline', 'middle');
    group.appendChild(text);
    return group;
  });

  
}


ReactDOM.render(<App />, document.getElementById('root'));


