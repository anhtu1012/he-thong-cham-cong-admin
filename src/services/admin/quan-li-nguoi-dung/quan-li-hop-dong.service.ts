/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "@/apis/axios.base";
import { ValidateBaseClass } from "@/apis/ddd/validate.class.base";
import {
  CreateContractSchema,
  UpdateContractSchema,
} from "@/dtos/quan-li-nguoi-dung/contracts/contract.dto";
import {
  CreateContractRequest,
  UpdateContractRequest,
} from "@/dtos/quan-li-nguoi-dung/contracts/contract.request.dto";
import { UserContractResponseGetItem } from "@/dtos/quan-li-nguoi-dung/contracts/contract.response.dto";

class QuanLyHopDongServicesBase extends AxiosService {
  protected readonly basePath = "/v1/business";

  async getContractById(id: string): Promise<any> {
    return this.get(`${this.basePath}/${id}`);
  }

  async createContract(formData: CreateContractRequest): Promise<any> {
    await ValidateBaseClass.validate(formData, CreateContractSchema);
    return this.post(`${this.basePath}/create-contract-with-branch`, formData);
  }

  async updateContract(
    id: string,
    formData: UpdateContractRequest
  ): Promise<any> {
    await ValidateBaseClass.validate(formData, UpdateContractSchema);
    return this.put(`${this.basePath}/${id}`, formData);
  }

  async deleteContract(id: string): Promise<any> {
    return this.delete(`${this.basePath}/${id}`);
  }

  async getContractsByUserCode(
    userCode: string
  ): Promise<UserContractResponseGetItem> {
    return this.getWithFilter(`${this.basePath}/by-user-code/${userCode}`);
  }
}

const QuanLyHopDongServices = new QuanLyHopDongServicesBase();
export default QuanLyHopDongServices;
