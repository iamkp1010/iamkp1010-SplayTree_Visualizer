function Node(key) {
    this.key = key;
    this.left = null;
    this.right = null;
}
function SplayBst() {
    this.root = null;
}

SplayBst.prototype.search = function (k) {
    if (this.root === null || (!(Number(k) || k === 0) && typeof k !== "string"))
        return null;

    this.splay(k);
    return this.root.key === k ? this.root : null;
};

SplayBst.prototype.insert = function (k) {
    var n;
    if ((!(Number(k) || k === 0) && typeof k !== "string")) {
        throw new Error("Invalid insert");
        return;
    }

    //there is no root yet
    if (this.root === null) {
        this.root = new Node(k);
        return;
    }
    //splay the closest existing match to the root
    this.splay(k);

    //if existing root key > new root key
    //link the existing left as the new left
    //and the current root becomes the new right
    if (this.root.key > k) {
        n = new Node(k);
        n.left = this.root.left;
        n.right = this.root;
        this.root.left = null;
        this.root = n;
    }

    //if existing root key < new root key
    //link the existing right as the new right
    //and the current root becomes the new left

    else if (this.root.key < k) {
        n = new Node(k);
        n.right = this.root.right;
        n.left = this.root;
        this.root.right = null;
        this.root = n;
    }

};

SplayBst.prototype.remove = function (k) {
    var temp;
    if (this.root === null || (!(Number(k) || k === 0) && typeof k !== "string"))
        return;
    //splay based on removal key
    this.splay(k);

    if (this.root.key === k) {
        //no subtrees
        if (this.root.left === null && this.root.right === null) {
            this.root = null;
            //only right subtree
        } else if (this.root.left === null) {
            this.root = this.root.right;
            //both subtrees
            //unlink root and join subtrees
        } else {
            //store right subtree
            temp = this.root.right;
            //store left subtree
            this.root = this.root.left;
            this.splay(k);
            //reconnect right subtree
            this.root.right = temp;
        }
    }

};

SplayBst.prototype.min = function (n) {
    var current;
    var minRecursive = function (cNode) {
        if (cNode.left) {
            return minRecursive(cNode.left);
        }
        return cNode;
    };

    if (this.root === null)
        return null;

    if (n instanceof Node)
        current = n;
    else
        current = this.root;

    return minRecursive(current);
};

SplayBst.prototype.max = function (n) {
    var current;
    var maxRecursive = function (cNode) {
        if (cNode.right) {
            return maxRecursive(cNode.right);
        }
        return cNode;
    };

    if (this.root === null)
        return null;

    if (n instanceof Node)
        current = n;
    else
        current = this.root;

    return maxRecursive(current);
};

SplayBst.prototype.inOrder = function (n, fun) {
    if (n instanceof Node) {
        this.inOrder(n.left, fun);
        if (fun) { fun(n); }
        this.inOrder(n.right, fun);
    }
};

//True if the key exists in the tree
//False if the key does not exist in the tree
SplayBst.prototype.contains = function (k) {
    var containsRecursive = function (n) {
        if (n instanceof Node) {
            if (n.key === k) {
                return true;
            }
            containsRecursive(n.left);
            containsRecursive(n.right);
        }
    };

    if (this.root === null || (!(Number(k) || k === 0) && typeof k !== "string"))
        return false;

    return containsRecursive(this.root) ? true : false;
};

//Rotate node to the right
//(becomes right child of its left child)
SplayBst.prototype.rotateRight = function (n) {
    var temp;
    if (n instanceof Node) {
        temp = n.left;
        n.left = temp.right;
        temp.right = n;
    }
    return temp;
};

//Rotate node to the left
//(becomes left child of its right child)
SplayBst.prototype.rotateLeft = function (n) {
    var temp;
    if (n instanceof Node) {
        temp = n.right;
        n.right = temp.left;
        temp.left = n;
    }
    return temp;
};

SplayBst.prototype.splay = function (k) {
    var splayRecursive = function (n, key) {
        //if empty return
        if (n === null)
            return null;

        //go left
        if (key < n.key) {
            //Key is not in tree, exit
            if (n.left === null)
                return n;

            //Zig-Zig
            if (key < n.left.key) {
                //Recursively get node matching key
                n.left.left = splayRecursive(n.left.left, key);
                //Rotate parent around grandparent
                n = this.rotateRight(n);

                //Zig-Zag
            } else if (key > n.left.key) {
                //Recursively get node matching key
                n.left.right = splayRecursive(n.left.right, key);
                //Rotate x around current parent
                if (n.left.right !== null)
                    n.left = this.rotateLeft(n.left);
            }

            //Rotate x around current parent
            if (n.left === null)
                return n;
            else
                return this.rotateRight(n);

            //go right
        } else if (key > n.key) {
            // Key is not in tree, exit
            if (n.right === null)
                return n;

            //Zig-Zig 
            if (key > n.right.key) {
                //Recursively get node matching key
                n.right.right = splayRecursive(n.right.right, key);
                //Rotate parent around grandparent
                n = this.rotateLeft(n);

                //Zig-Zag 
            } else if (key < n.right.key) {
                //Recursively get node matching key
                n.right.left = splayRecursive(n.right.left, key);
                //Rotate x around current parent
                if (n.right.left !== null)
                    n.right = this.rotateRight(n.right);
            }

            //Rotate x around current parent
            if (n.right === null)
                return n;
            else
                return this.rotateLeft(n);
        } else {
            return n;
        }

    }.bind(this);

    if (this.root === null || (!(Number(k) || k === 0) && typeof k !== "string")) {
        throw new Error("Invalid splay");
        return;
    }

    this.root = splayRecursive(this.root, k);
    return;
};


var visualJson = function (n) {
    var buildJson = function (cNode) {
        var jObj = {};
        if (cNode !== null) {
            jObj.key = cNode.key;
            jObj.children = [];

            jObj.children.push(buildJson(cNode.left));
            jObj.children.push(buildJson(cNode.right));
        } else {
            jObj.key = "NULL";
        }
        return jObj;
    };

    if (!(n instanceof Node))
        return null;

    return buildJson(n);
};

var init = function () {
    //Tree Instance
    var splayTree = new SplayBst();

    //diagram dimensions
    var margin = { top: 100, right: 20, bottom: 20, left: 20 },
        width = 960 - margin.right - margin.left,
        height = 1000 - margin.top - margin.bottom;

    var svg = d3.select("#tree-display").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var tree = d3.layout.tree().size([height, width]);

    var diagonal = d3.svg.diagonal().projection(function (d) { return [d.x, d.y]; });

    //d3
    var drawTree = function (root) {
        var i = 0;
        var nodes, links;
        //clear existing nodes
        svg.selectAll('.node').remove();
        svg.selectAll('.link').remove();

        if (root === null)
            return;

        nodes = tree.nodes(root).reverse();
        links = tree.links(nodes);

        nodes.forEach(function (d) {
            d.y = d.depth * 70;
        });

        //setup node elements
        var node = svg.selectAll("g.node").data(nodes, function (d) {
            return d.id || (d.id = ++i);
        });
        //node location, shape, and text
        var nodeEnter = node.enter().append("g")

            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        nodeEnter.append("circle")
            .attr("r", 18)
            .style("fill", "#fff");

        nodeEnter.append("text")
            .attr("y", 30)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .text(function (d) {
                return d.key;
            })
            .style("font-size", "15px");

        var link = svg.selectAll("path.link").data(links, function (d) {
            return d.target.id;
        });

        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", diagonal);
    }

    var highlightMax = function (t) {
        var maxNode;
        if (!(t instanceof SplayBst))
            return;
        else
            maxNode = t.max();

        if (maxNode === null)
            return;

        d3.selectAll("g.node").each(function (d, i) {
            var clearStyle = function () {
                d3.select(this).classed("max", false);
            }.bind(this);
            if (d.key === maxNode.key) {
                d3.select(this).classed("max", true);
                setTimeout(clearStyle, 2000);
            }
        });
    };

    var highlightMin = function (t) {
        var minNode;
        if (!(t instanceof SplayBst))
            return;
        else
            minNode = t.min();

        if (minNode === null)
            return;

        d3.selectAll("g.node").each(function (d, i) {
            var clearStyle = function () {
                d3.select(this).classed("min", false);
            }.bind(this);
            if (d.key === minNode.key) {
                d3.select(this).classed("min", true);
                setTimeout(clearStyle, 2000);
            }
        });
    };

    var formAdd = document.getElementById("add-form");
    var formRemove = document.getElementById("remove-form");
    var formSearch = document.getElementById("search-form");
    var minButton = document.getElementById("min-button");
    var maxButton = document.getElementById("max-button");

    formAdd.addEventListener("submit", function (e) {
        var k;
        e.preventDefault();
        k = e.target.keyText.value;

        if ((Number(k) || k === "0")) {
            splayTree.insert(Number(k));
            drawTree(visualJson(splayTree.root));
            e.target.reset();
        } else {
            alert("key value must be integer/float");
        }
    });

    formRemove.addEventListener("submit", function (e) {
        var k;
        e.preventDefault();
        k = e.target.removeText.value;

        if (Number(k) || k === "0") {
            splayTree.remove(Number(k));
            drawTree(visualJson(splayTree.root));
            e.target.reset();
        } else {
            alert("key value must be a integer/float");
        }
    });

    //search event
    formSearch.addEventListener("submit", function (e) {
        var k;
        e.preventDefault();
        k = e.target.searchText.value;

        if (Number(k) || k === "0") {
            splayTree.search(Number(k));
            drawTree(visualJson(splayTree.root));
            e.target.reset();
        } else {
            alert("key value must be a integer/float");
        }
    });

    maxButton.addEventListener("click", function (e) {
        e.preventDefault();
        highlightMax(splayTree);
    });

    minButton.addEventListener("click", function (e) {
        e.preventDefault();
        highlightMin(splayTree);
    });

};

window.onload = init;