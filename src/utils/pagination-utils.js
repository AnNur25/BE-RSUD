class Pagination {
  static paginate(page = 1, pageSize = 10) {
    page = parseInt(page);
    pageSize = parseInt(pageSize);

    if (page < 1) page = 1;
    if (pageSize < 1) pageSize = 10;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    return { skip, take, page, pageSize }; 
  }
}

module.exports = Pagination;
