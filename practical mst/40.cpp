class Solution {
public:
    vector<vector<int>> combinationSum2(vector<int>& candidates, int target) {
        int n=candidates.size();
        int sum=0;
        for(int i=0;i<n;i++)
        {
            for(int j=i;j<n;j++)
        { if(candidates[j]>candidates[j+1])
        {
            int t=candidates[j];
            candidates[j]=candidates[j+1];
            candidates[j+1]=t;

        }

        }
        }
        if(target==sum)
            break;

    }
};