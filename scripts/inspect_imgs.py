from bs4 import BeautifulSoup
with open('tmp_prod487.html','rb') as f:
    html = f.read()
soup = BeautifulSoup(html, 'html.parser')
imgs = soup.find_all('img')
for i,img in enumerate(imgs):
    print(i, img.get('src'), '||', img.get('srcset'))
