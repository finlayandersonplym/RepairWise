var builder = WebApplication.CreateBuilder(args);


var app = builder.Build();

app.UseRouting();

app.UseDefaultFiles();
app.UseStaticFiles();


app.Run();
