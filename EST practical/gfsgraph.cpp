class Solution {
  public:
    vector<int> dfs(vector<vector<int>>& adj) {
        // Code here
     
        int V = adj.size();              
        vector<int> result;              
        vector<bool> visited(V, false);  

       
        function<void(int)> dfsHelper = [&](int node) {
            visited[node] = true;
            result.push_back(node); 

          
            for (int neighbor : adj[node]) {
                if (!visited[neighbor]) {
                    dfsHelper(neighbor);
                }
            }
        };

        dfsHelper(0); 
        return result;
    }
};
