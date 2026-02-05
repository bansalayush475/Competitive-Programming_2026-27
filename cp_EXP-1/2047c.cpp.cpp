#include <iostream>
#include <string>
using namespace std;
 
int main() {
    int t;
    cin >> t;
 
    while (t--) {
        int n;
        string s;
        cin >> n >> s;
 
        if (n == 1) {
            cout << s << "\n";
            continue;
        }
 
        int freq[26] = {0};
 
        for (int i = 0; i < n; i++) {
            freq[s[i] - 'a']++;
        }
 
        
        int maxChar = -1;
        for (int i = 0; i < 26; i++) {
            if (freq[i] > 0) {
                if (maxChar == -1 ||
                    freq[i] > freq[maxChar] ||
                   (freq[i] == freq[maxChar] && i > maxChar)) {
                    maxChar = i;
                }
            }
        }
 
       
        int minChar = -1;
        for (int i = 0; i < 26; i++) {
            if (i != maxChar && freq[i] > 0) {
                if (minChar == -1 ||
                    freq[i] < freq[minChar] ||
                   (freq[i] == freq[minChar] && i < minChar)) {
                    minChar = i;
                }
            }
        }
 
     
        for (int i = 0; i < n; i++) {
            if (s[i] - 'a' == minChar) {
                s[i] = char('a' + maxChar);
                break;
            }
        }
 
        cout << s << "\n";
    }
 
    return 0;
}