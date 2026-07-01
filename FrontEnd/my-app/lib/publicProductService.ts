const API_URL = 'http://localhost:8080/api/v1/public/products';

export interface PublicProductResponse {
  productId: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  images: string[];
  status: string;
  storeId: number;
  storeName: string;
}

export async function searchProducts(keyword: string = ''): Promise<PublicProductResponse[]> {
  try {
    const res = await fetch(`${API_URL}?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    if (data.code === 200 && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProductById(id: number): Promise<PublicProductResponse | null> {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch product details');
    }

    const data = await res.json();
    if (data.code === 200 && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product details for ID ${id}:`, error);
    return null;
  }
}
