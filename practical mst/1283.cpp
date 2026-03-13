class Solution {
public:
    int smallestDivisor(vector<int>& nums, int threshold) {
        int n=nums.size();
        int high=nums[0];
        for(int i=1;i<n;i++)
        {
            if(nums[i]>high)
            {
                high=nums[i];
            }
        }
        int low=1;
        while(low<=high)
        {
            int mid=(low+high)/2;
            int sum=0;
            for(int i=0;i<n;i++)
            {
                sum=sum+(nums[i]+mid-1)/mid;
            }
            if(sum<=threshold)
            {
                high=mid-1;
            }
            else
            {
                low=mid+1;
            }
        }
        return low;
    }
};

       