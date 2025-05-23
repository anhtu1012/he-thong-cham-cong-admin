/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosService } from "../../apis/axios.base";
import { SelectOptionsArray } from "../../dtos/select/select.dto";

class SelectServicesBase extends AxiosService {
  protected readonly basePath = "/v1/dropdown";
  async getDanhMuc(id: string, maBrand?: string): Promise<SelectOptionsArray> {
    if (maBrand) {
      return this.getWithParams(
        `${this.basePath}/dropdown-user/${id}`,
        new URLSearchParams({ maBrand })
      );
    }
    return this.get(`${this.basePath}/dropdown-user/${id}`);
  }
  async getSelectBrand(): Promise<SelectOptionsArray[]> {
    return this.get(`${this.basePath}/dropdown-branch`);
  }
  async getSelectPosition(): Promise<SelectOptionsArray[]> {
    return this.get(`${this.basePath}/dropdown-position`);
  }

  // New methods for dependent dropdowns
  async getSelectManagers(
    branchCode: string,
    roleCode: string
  ): Promise<SelectOptionsArray> {
    return this.getWithParams(
      `${this.basePath}/dropdown-user`,
      new URLSearchParams({ branchCode, roleCode })
    );
  }

  async getSelectPositionByRole(roleCode: string): Promise<SelectOptionsArray> {
    return this.getWithParams(
      `${this.basePath}/dropdown-position`,
      new URLSearchParams({ roleCode })
    );
  }
}

const SelectServices = new SelectServicesBase();
export default SelectServices;
