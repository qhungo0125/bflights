async function pagination(req, res, next) {
    let { page = process.env.page, perPage = process.env.perPage } =
        req.query;

    if (parseInt(page)) {
        page = parseInt(page)
    } else {
        return res.status(500).json({error: "Page must be a number"})
    }

    if (parseInt(perPage)) {
        perPage = parseInt(perPage)
    } else {
        return res.status(500).json({error: "PerPage must be a number"})
    }
    
    const startIdx = (page - 1) * perPage
    const endIdx = page * perPage

    // Override the res.json method to include pagination metadata
    const oldJsonMethod = res.json;
    res.json = (results) => {
        const actuallyResults = results.slice(startIdx, endIdx);
        const metadata = getPaginationMetadata(results, page, perPage);

        return oldJsonMethod.call(res, {
            results: actuallyResults,
            metadata,
        });
    };

    next()
}

function getPaginationMetadata(data, page, perPage) {
    const totalCount = data.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const metadata = {
        totalCount,
        perPage,
        currentPage: page,
        totalPages,
    };
    return metadata;
}

module.exports = pagination