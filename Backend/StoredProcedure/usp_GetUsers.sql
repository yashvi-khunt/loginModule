USE [login-system]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetUsers]    Script Date: 19-04-2024 09:10:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[usp_GetUsers]
    @Field NVARCHAR(50) = 'Id', --code
    @Sort NVARCHAR(50) = 'asc', -- asc
    @Page BIGINT = 1,
    @PageSize BIGINT = 10,
	@Text NVARCHAR(MAX)='',
	@FromDate DATE = '',
	@ToDate DATE = '',
	@UserIds NVARCHAR(MAX) = ''
AS
BEGIN


 DROP TABLE IF EXISTS #tempUsers

 
	SELECT a.Id
	INTO #tempUsers
	FROM AspNetUsers a
	INNER JOIN AspNetUserRoles ur ON ur.UserId = a.Id
	WHERE (@Text = '' OR  (a.Email LIKE '%'+@Text+'%'))
	AND (@UserIds='' OR a.Id IN (SELECT value FROM STRING_SPLIT(@UserIds, ',')))
	  AND ((@FromDate = '' AND @ToDate = '') OR (@ToDate='' AND CreatedDate >= @FromDate) OR (CreatedDate BETWEEN @FromDate AND @ToDate))	
	GROUP BY a.Id

   -- It returns number of users after applying filters.
   SELECT Count(*) AS count FROM #tempUsers

   -- it returns all data for users from #tempUsers
    SELECT 
    ROW_NUMBER() OVER (Order By 
	 CASE WHEN @Field = 'firstName' AND @Sort = 'asc' THEN firstname END ASC,
                CASE WHEN @Field = 'firstName' AND @Sort = 'desc' THEN firstname END DESC,
                CASE WHEN @Field = 'lastName' AND @Sort = 'asc' THEN lastname END ASC,
                CASE WHEN @Field = 'lastName' AND @Sort = 'desc' THEN lastname END DESC,
                CASE WHEN @Field = 'email' AND @Sort = 'asc' THEN email END ASC,
                CASE WHEN @Field = 'email' AND @Sort = 'desc' THEN email END DESC,
                CASE WHEN @Field = 'createdDate' AND @Sort = 'asc' THEN createdDate END ASC,
                CASE WHEN @Field = 'createdDate' AND @Sort = 'desc' THEN createdDate END DESC
     )
     AS Id ,a.Id AS UserId,a.UserName,a.FirstName,a.LastName,a.CreatedDate,r.Name as Role,a.IsActivated, a.Email 
	 FROM AspNetUsers a
	 INNER JOIN AspNetUserRoles ur ON ur.UserId = a.Id
     INNER JOIN AspNetRoles r ON r.Id = ur.RoleId
	 INNER JOIN #tempUsers tu ON tu.Id = a.Id
    ORDER BY Id
   
    OFFSET (@Page-1) * @pageSize ROWS FETCH NEXT @pagesize ROWS ONLY

END

--exec [usp_GetUsers] @Page = 1,@pageSize =10, @Field = '',@Sort ='asc',@UserIds = '',@fromDate='2024-04-17',@toDate=''



