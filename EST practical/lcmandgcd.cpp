class Solution {
public:

    int Gcd(int a, int b) {
        if (a == 0)
            return b;
        return Gcd(b%a,a);
    }

    vector<int> lcmAndGcd(int a, int b) {
        int gcd = Gcd(a, b);
        int lcm = (a * b) / gcd;
        
        return {lcm, gcd};
    }
};