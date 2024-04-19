USE [login-system]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetLoginHistory]    Script Date: 19-04-2024 09:48:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[usp_GetLoginHistory]
   
    @Field NVARCHAR(50) = 'date', --code
    @Sort NVARCHAR(50) = 'desc', -- asc
    @Page BIGINT = 1,
    @PageSize BIGINT = 10,
	@Text NVARCHAR(MAX)='',
	@UserIds nvarchar(MAX) = '',
	@FromDate DATE = '',
	@ToDate DATE = ''
AS
BEGIN


 DROP TABLE IF EXISTS #tempLoginHistory
 
	SELECT lh.Id
	INTO #tempLoginHistory
	FROM LoginHistories lh
	WHERE (@UserIds = '' OR lh.UserId IN (SELECT value FROM STRING_SPLIT(@UserIds, ','))) AND (@Text = '' OR (lh.IpAddress LIKE '%'+@Text+'%') OR (lh.Browser LIKE '%'+@Text+'%') OR (lh.OS LIKE '%'+@Text+'%'))
	  AND ((@FromDate = '' AND @ToDate = '') OR (@ToDate = '' AND lh.DateTime >= @FromDate) OR (lh.DateTime BETWEEN @FromDate AND @ToDate))	
	GROUP BY lh.Id

   -- It returns number of users after applying filters.
   SELECT Count(*) AS count FROM #tempLoginHistory

   -- it returns all data for users from #tempLoginHistory
    SELECT 
    ROW_NUMBER() OVER (Order By 
	 CASE WHEN @Field = 'userName' AND @Sort = 'asc' THEN a.UserName END ASC,
                CASE WHEN @Field = 'userName' AND @Sort = 'desc' THEN a.UserName END DESC,
                CASE WHEN @Field = 'date' AND @Sort = 'asc' THEN lh.datetime END ASC,
                CASE WHEN @Field = 'date' AND @Sort = 'desc' THEN lh.datetime END DESC,
                CASE WHEN @Field = 'ipAddress' AND @Sort = 'asc' THEN lh.ipAddress END ASC,
                CASE WHEN @Field = 'ipAddress' AND @Sort = 'desc' THEN lh.ipAddress END DESC,
                CASE WHEN @Field = 'browser' AND @Sort = 'asc' THEN lh.browser END ASC,
                CASE WHEN @Field = 'browser' AND @Sort = 'desc' THEN lh.browser END DESC,
				CASE WHEN @Field = 'os' AND @Sort = 'asc' THEN lh.OS END ASC,
                CASE WHEN @Field = 'os' AND @Sort = 'desc' THEN lh.OS END DESC

     )
     AS Id ,a.Id AS UserId,a.UserName,lh.DateTime,lh.IpAddress,lh.Browser,lh.OS,lh.Device
	 FROM AspNetUsers a
	 INNER JOIN LoginHistories lh ON a.Id = lh.UserId
	 INNER JOIN #tempLoginHistory tlh ON tlh.Id = lh.Id	
	 order by Id
    OFFSET (@Page-1) * @pageSize ROWS FETCH NEXT @pagesize ROWS ONLY

END

--exec [usp_GetLoginHistory] @Page = 1,@pageSize =25, @Field = 'ipAddress',@Sort ='asc',@Text='',@fromDate='',@toDate='',@UserIds=''

