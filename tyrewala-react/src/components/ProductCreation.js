import React, { Component } from "react";

class ProductCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productTitle: "",
      productHasVariation: true, // assuming default value for productHasVariation
      vendorList: [],
      selectedVendor: "",
      categoryList: [],
      selectedCategory: "",
      subCategoryList: [],
      selectedSubCategory: "",
      productTypeList: [],
      selectedProductType: "",
      isAdmin: true, // assuming default value for isAdmin
      addProductForm: {}, // assuming you have defined form controls
      submitted: false,
      errorsMap: {
        vendor: "",
        category: "",
        productName: "",
        subCategory: "",
        manufacturer: "",
        productType: "",
      },
    };
  }

  goBack() {
    // Implementation of goBack function
  }

  variationYesOrNo() {
    // Implementation of variationYesOrNo function
  }

  beforeChange() {
    // Implementation of beforeChange function
  }

  getAllSubCategory() {
    // Implementation of getAllSubCategory function
  }

  getAllProductType() {
    // Implementation of getAllProductType function
  }

  getAllProductBrandBySubCategory() {
    // Implementation of getAllProductBrandBySubCategory function
  }

  getProductTypeById() {
    // Implementation of getProductTypeById function
  }

  open(category) {
    // Implementation of open function
  }

  trackByIndex(item, index) {
    return index;
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card mb-3 shadow">
              <div className="card-header">
                <div className="row">
                  <h5 className="col-xl-4">{this.state.productTitle}</h5>
                  <div className="col-xl-8 text-right">
                    <button className="btn btn-secondary" onClick={this.goBack}>
                      Back
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body tab2-card">
                <form>
                  <div className="row">
                    {this.state.productHasVariation === false && (
                      <div className="col-lg-4">
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control form-control-alternative"
                            placeholder="Enter SKU Code"
                            maxLength="10"
                            autoComplete="off"
                          />
                          <p className="text-danger">
                            Please Provide Product SKU Code
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="col-lg-2">
                      <div className="form-group">
                        <label className="form-control-label">Brand :</label>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="form-group">
                        <select className="form-control">
                          <option value="">Select Brand</option>
                          {this.state.brandList.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.brandName}
                            </option>
                          ))}
                        </select>
                        <p className="text-danger">Please Select Brand</p>
                      </div>
                    </div>
                    <div className="col-lg-1 text-left p-2">
                      {this.state.isAdmin && (
                        <a
                          className="btn btn-link text-success p-0"
                          onClick={() => this.open("brand")}
                        >
                          <i className="fa fa-plus append-icon"></i>
                        </a>
                      )}
                    </div>
                    <div className="col-lg-2">
                      <div className="form-group">
                        <label className="form-control-label">
                          Specifications :
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-9 text-right pr-0">
                      <div className="row">
                        {this.state.specificationsByProductType.map(
                          (specification, index) => (
                            <div className="col-lg-5" key={index}>
                              <div className="row form-group">
                                <div className="col-sm-4">
                                  <div className="input-group-sm">
                                    <input
                                      type="text"
                                      className="form-control pr-0"
                                      placeholder="Ex Weight"
                                      onBlur={(event) =>
                                        this.updateList(
                                          index,
                                          "specificationName",
                                          event
                                        )
                                      }
                                      value={specification.specificationName}
                                    />
                                  </div>
                                </div>
                                <div className="col-sm-6 pr-0 input-group-sm">
                                  <input
                                    type="text"
                                    onBlur={(event) =>
                                      this.updateList(index, "value", event)
                                    }
                                    placeholder={`Enter ${specification.specificationName}`}
                                    className="form-control"
                                    value={specification.value}
                                  />
                                </div>
                                <div className="col-sm-1 input-group-sm">
                                  {!specification.mandatory && (
                                    <a
                                      onClick={() =>
                                        this.removeSpecification(index)
                                      }
                                      href="#"
                                    >
                                      <i
                                        className="fa fa-trash fa-lg"
                                        aria-hidden="true"
                                        style={{ color: "rgb(238, 34, 51)" }}
                                      ></i>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                        <div className="col-sm-1">
                          <a
                            className="btn btn-link text-success p-0"
                            onClick={() => this.addSpecification()}
                          >
                            <i
                              className="fa fa-plus append-icon"
                              style={{ fontSize: "x-large" }}
                            ></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>{" "}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCreation;
