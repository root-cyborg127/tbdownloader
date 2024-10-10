import re

# Function to extract Terabox URLs from the HTML content and clean them
def extract_terabox_urls(html_content):
    # Regular expression to match Terabox URLs
    terabox_pattern = re.compile(r'https?://1024terabox\.com/s/[^\s">]+')

    # Find all Terabox URLs in the HTML content
    urls = terabox_pattern.findall(html_content)
    
    # Clean URLs that have trailing '</a' or any similar disturbances
    cleaned_urls = [url.split('</a')[0] for url in urls]
    
    if cleaned_urls:
        print(f"Found {len(cleaned_urls)} URLs:")
        for url in cleaned_urls:
            print(url)  # Print each cleaned URL for verification
    else:
        print("No URLs found.")
    
    # Return a set of unique cleaned URLs
    return set(cleaned_urls)

# Function to save URLs to a text file
def save_urls_to_file(urls, file_name='terabox_urls.txt'):
    # Open the file with UTF-8 encoding
    with open(file_name, 'w', encoding='utf-8') as f:
        for url in urls:
            f.write(url + '\n')  # Ensure each URL is on a new line
    print(f"URLs saved to {file_name} successfully!")

# Main execution
if __name__ == "__main__":
    # Load your HTML content from a file
    try:
        with open('input.html', 'r', encoding='utf-8') as file:
            html_content = file.read()
        print("HTML content loaded successfully.")
    except Exception as e:
        print(f"Error reading file: {e}")
        exit()

    # Extract and clean Terabox URLs
    unique_urls = extract_terabox_urls(html_content)

    # If URLs were extracted, save them to the file
    if unique_urls:
        save_urls_to_file(unique_urls)
    else:
        print("No URLs extracted to save.")
