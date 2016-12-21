/**
 * Created by v.litvak on 21.12.2016.
 */

let generalData = [
    ['A-16', 'B-16', 'B-15'],
    ['English','Java'],
    ['Ira', 'Kolya', 'Oleg']
];

let capacity = [
    //Groups - lessons - capacity
    [ generalData[0][0], generalData[1][0], 10],
    [ generalData[0][1], generalData[1][0], 15],
    [ generalData[0][1], generalData[1][1], 17],
    [ generalData[0][2], generalData[1][1], 20],

    //Teacher - lessons - capacity
    [ generalData[1][0], generalData[2][0], 16],
    [ generalData[1][0], generalData[2][1], 12],
    [ generalData[1][0], generalData[2][2], 10],
    [ generalData[1][1], generalData[2][0], 10],
    [ generalData[1][1], generalData[2][1], 15],
    [ generalData[1][1], generalData[2][2], 11]
];

//number of vertexes ,
let V = getNodeCount(generalData);
//number of edges
let E = getEdgeCount(generalData, capacity);

function getNodeCount(data)
{
    let count = 2; // +2 - means +s (source) and +t (tail) vertex as default

    if(data instanceof Array)
    {
        data.forEach((node) => {
            if(node instanceof Array)
            {
                count += node.length;
            }
            // console.log(`Node - ${node}`);
        })
    }
    return count;
}

function getEdgeCount(nodes,edges)
{
    let count = 0;

    //get count of edges from 's' to first nodes line
    //and count of edges from last nodes line to 't'
    if(nodes instanceof Array && nodes.length > 0)
    {
        if(nodes[0] instanceof Array)
            count += nodes[0].length;
        if(nodes[nodes.length-1] instanceof Array)
            count += nodes[nodes.length-1].length;
    }

    //get count other edges
    if(edges instanceof Array)
    {
        count += edges.length;
    }

    return count;
}

function makeFullGraphCapacity(s, t)
{
    let startFlow = endFlow = 999999;//Number.MAX_VALUE;
    //capacity matrix
    let c = [];
    if(generalData instanceof Array && generalData[0] instanceof Array)
    {
        c = generalData[0].map((edge) => {
            return [s.toString(), edge, startFlow];
        });
        if(capacity instanceof Array)
        {
            capacity.forEach((edge) => {
                c.push(edge);
            });
        }
        generalData[generalData.length-1].map((edge) => {
            c.push([edge, t, endFlow]);
        });
    }
    return c;
}

function initPreflow(s, t)
{
    //vertexes height
    let h = [];
    //excess flow
    let e = [];

    h.push([s, 0]);
    e.push([s, 0]);
    if(generalData instanceof Array)
        for(let j = 0; j < generalData.length; j++)
            if(generalData[j] instanceof Array)
                for(let k = 0; k < generalData[j].length; k++)
                {
                    h.push([generalData[j][k], 0]);
                    e.push([generalData[j][k], 0]);
                };
    h.push([t, 0]);
    e.push([t, 0]);

    console.log(`Heights h: ${h}`);

    //max capacity of edges
    let c = makeFullGraphCapacity(s, t);
    console.log(`Full capacity matrix C:`);
    c.forEach((item)=>{console.log(item)});
    //start flow capacity of edges
    let f = [];
    c.forEach((edge) => {
        let item = [edge[0], edge[1], 0];
        f.push(item);
    });
    //reverse edges
    c.forEach((edge) => {
        let item = [edge[1], edge[0], 0];
        f.push(item);
    });
    // console.log(`Start flow capacity matrix F:`);
    // f.forEach((item)=>{console.log(item)});

    if(generalData instanceof Array && generalData[0] instanceof Array)
    {
        generalData[0].forEach((node) => {
            f.forEach((f_s_u) => {
                if(f_s_u[0] === s && f_s_u[1] === node)
                {
                    c.forEach((c_s_u) => {
                        if(f_s_u[0] === c_s_u[0] && f_s_u[1] === c_s_u[1])
                            f_s_u[2] = c_s_u[2];
                    });
                }
                if(f_s_u[1] === s && f_s_u[0] === node)
                {
                    c.forEach((c_s_u) => {
                        if(f_s_u[1] === c_s_u[0] && f_s_u[0] === c_s_u[1])
                            f_s_u[2] = -c_s_u[2];

                    });
                }
            });
            e.forEach((e_u) => {
                if(e_u[0] === node)
                {
                    c.forEach((c_u_v) => {
                        if(c_u_v[0] === s && c_u_v[1] === node)
                        {
                            e_u[1] = c_u_v[2];
                        }
                    });
                }
                if(e_u[0] === s)
                {
                    c.forEach((c_u_v) => {
                        if(c_u_v[1] === s && c_u_v[0] === node)
                        {
                            e_u[1] -= c_u_v[2];
                        }
                    });
                }
            })
        });
    }

    console.log(`Initialized flow capacity:`);
    f.forEach((item)=>{console.log(item)});

    console.log(`e : ${e}`);
}

initPreflow('source', 'tail');

// console.log(`Groups workload: ${JSON.stringify(capacity)}`);
console.log(`Vertex count: ${V}`);
console.log(`Edge count: ${E}`);