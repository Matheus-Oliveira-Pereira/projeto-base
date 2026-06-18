import api from './api';

class BaseService<T = unknown> {
  private resourcePath: string;

  constructor(resourcePath: string) {
    this.resourcePath = resourcePath;
  }

  async getAll(params: Record<string, unknown> = {}): Promise<T[]> {
    const response = await api.get<T[]>(this.resourcePath, { params });
    return response.data;
  }

  async getById(id: string): Promise<T> {
    const response = await api.get<T>(`${this.resourcePath}/${id}`);
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await api.post<T>(this.resourcePath, data);
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await api.put<T>(`${this.resourcePath}/${id}`, data);
    return response.data;
  }

  async remove(id: string): Promise<void> {
    await api.delete(`${this.resourcePath}/${id}`);
  }
}

export default BaseService;
