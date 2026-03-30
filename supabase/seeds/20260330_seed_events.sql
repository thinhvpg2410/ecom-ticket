-- Seed current events data from src/data.ts
-- Requires: public.organizers, public.events, public.event_tickets

begin;

insert into public.organizers (id, name, logo_url)
values
  ('org_pickleball_vietnam', 'Pickleball Vietnam', null),
  ('org_ppa_asia', 'PPA Asia', null),
  ('org_pro_am_basketball', 'Pro-Am Basketball', null),
  ('org_lion_championship', 'Lion Championship', null),
  ('org_saigon_basketball', 'Saigon Basketball', null),
  ('org_garena', 'Garena', null),
  ('org_vba', 'VBA', null),
  ('org_san_khau_the_gioi_tre', 'Sân Khấu Thế Giới Trẻ', null),
  ('org_nha_hat_kich_tphcm', 'Nhà hát Kịch TP.HCM', null),
  ('org_idecaf', 'IDECAF', null),
  ('org_san_khau_thien_dang', 'Sân khấu Thiên Đăng', null),
  ('org_nha_hat_ben_thanh', 'Nhà Hát Bến Thành', null),
  ('org_sknt_truong_hung_minh', 'SKNT Trương Hùng Minh', null),
  ('org_hanoi_paragliding', 'Hanoi Paragliding', null),
  ('org_khu_di_tich_cu_chi', 'Khu di tích Củ Chi', null),
  ('org_mcc_paragliding', 'MCC Paragliding', null),
  ('org_exporum_vietnam', 'Exporum Vietnam', null),
  ('org_ocean_city', 'Ocean City', null),
  ('org_saigon_opera_house', 'Saigon Opera House', null),
  ('org_tuan_chau_hn', 'Tuần Châu Hà Nội', null)
on conflict (id) do update set
  name = excluded.name,
  logo_url = excluded.logo_url;

insert into public.events (
  id, title, image_url, date_display, category, is_trending, location, type, description, organizer_id, status
)
values
  ('e1', 'Giải đấu PICKLEBALL TỨ HÙNG 2026', 'https://salt.tkbcdn.com/ts/ds/df/b5/42/ff357cffe19a0020eaa8361dbdd8233e.jpeg', '13:30 - 16:30, 11/04/2026', 'Thể thao', true, 'Hà Nội', 'event', 'Giải đấu Pickleball chuyên nghiệp quy tụ các tay vợt xuất sắc nhất khu vực miền Bắc.', 'org_pickleball_vietnam', 'published'),
  ('e2', 'PPA ASIA 1000 - MB HANOI CUP 2026', 'https://salt.tkbcdn.com/ts/ds/66/c4/1a/829f6d0533407aaa5a134c541e6f9bb9.png', '08:00 - 22:00, 01/04/2026', 'Thể thao', false, 'Hà Nội', 'event', 'Giải đấu thể thao quy mô lớn, tâm điểm của làng Pickleball Châu Á trong năm 2026.', 'org_ppa_asia', 'published'),
  ('e3', 'VIETNAM PRO-AM BASKETBALL CHAMPIONSHIP 2025', 'https://salt.tkbcdn.com/ts/ds/2d/31/3d/4b0f9252bc35025a06be58f823fcd231.jpg', '19:00 - 21:30, 05/11/2025', 'Thể thao', false, 'Hà Nội', 'event', 'Giải bóng rổ bán chuyên nghiệp Việt Nam 2025.', 'org_pro_am_basketball', 'ended'),
  ('e4', 'LION CHAMPIONSHIP 29 - 2025', 'https://salt.tkbcdn.com/ts/ds/2d/31/3d/4b0f9252bc35025a06be58f823fcd231.jpg', '20:00 - 23:00, 27/12/2025', 'Thể thao', false, 'Hà Nội', 'event', 'Giải vô địch võ thuật tổng hợp MMA Việt Nam.', 'org_lion_championship', 'ended'),
  ('e5', 'Saigon Pro-Am Basketball Cup 2025', 'https://salt.tkbcdn.com/ts/ds/2d/31/3d/4b0f9252bc35025a06be58f823fcd231.jpg', '15:00 - 19:30, 12/10/2025', 'Thể thao', false, 'Hồ Chí Minh', 'event', 'Giải đấu cúp bóng rổ Sài Gòn mở rộng.', 'org_saigon_basketball', 'ended'),
  ('e6', 'CHUNG KẾT ĐẤU TRƯỜNG DANH VỌNG MÙA ĐÔNG 2025', null, '10:00 - 22:00, 02/11/2025', 'Thể thao', true, 'Hà Nội', 'event', 'Chung kết eSports đỉnh cao với sức nóng bùng nổ.', 'org_garena', 'ended'),
  ('e7', 'VBA STAR X 2025 | Game 59 - Danang Dragons vs Nha Trang Dolphins', 'https://salt.tkbcdn.com/ts/ds/b1/7d/fe/64315cffd15c11f69d2cdab57d946391.jpg', '19:00, 15/05/2026', 'Thể thao', true, 'Đà Nẵng', 'event', 'Trận so tài đỉnh cao nảy lửa của hai đội bóng rổ hàng đầu trong khuôn khổ VBA.', 'org_vba', 'published'),
  ('e8', 'VBA STAR X 2025 | Game 60 - Ho Chi Minh City Wings vs Hanoi Buffaloes', null, '19:00, 27/06/2026', 'Thể thao', true, 'Hồ Chí Minh', 'event', 'Đại chiến bóng rổ Nam Bắc đầy kịch tính.', 'org_vba', 'published'),
  ('e9', 'SÂN KHẤU THẾ GIỚI TRẺ: GÁNH HÁT VỀ KHUYA', null, '20:00, 22/05/2026', 'Sân khấu & nghệ thuật', true, 'Hồ Chí Minh', 'event', 'Vở diễn mang đậm dấu ấn Thế Giới Trẻ với những tràng cười sảng khoái và thông điệp sâu sắc.', 'org_san_khau_the_gioi_tre', 'published'),
  ('e10', 'NHÀ HÁT KỊCH: LÀNG VÔ TẶC', null, '20:00, 15/07/2026', 'Sân khấu & nghệ thuật', false, 'Hồ Chí Minh', 'event', 'Vở kịch mang đậm chất trào phúng và ý nghĩa nhân văn sâu sắc.', 'org_nha_hat_kich_tphcm', 'published'),
  ('e11', 'NHÀ HÁT KỊCH IDECAF: HỒN AI NẤY GIỮ', null, '19:30, 28/05/2026', 'Sân khấu & nghệ thuật', false, 'Hồ Chí Minh', 'event', 'Tác phẩm kịch nói đặc sắc quy tụ dàn diễn viên gạo cội của nhà hát IDECAF.', 'org_idecaf', 'published'),
  ('e12', 'SÂN KHẤU THIÊN ĐĂNG: XÓM VỊT TRỜI', null, '19:30, 20/07/2026', 'Sân khấu & nghệ thuật', true, 'Hồ Chí Minh', 'event', 'Tác phẩm mới đầy cảm xúc tại Sân khấu kịch Thiên Đăng.', 'org_san_khau_thien_dang', 'published'),
  ('e13', 'SÂN KHẤU THẾ GIỚI TRẺ: BÓNG ĐÀN ÔNG', null, '20:00, 25/07/2026', 'Sân khấu & nghệ thuật', false, 'Hồ Chí Minh', 'event', 'Một lăng kính thú vị và hài hước về cuộc sống.', 'org_san_khau_the_gioi_tre', 'published'),
  ('e14', '[Nhà Hát Bến Thành] Hài kịch: Đảo Hoa Hậu', null, '19:30, 05/08/2026', 'Sân khấu & nghệ thuật', false, 'Hồ Chí Minh', 'event', 'Tiếng cười sảng khoái với dàn diễn viên hài gạo cội.', 'org_nha_hat_ben_thanh', 'published'),
  ('e15', 'Sân Khấu Thế Giới Trẻ: Mật Mã Cầu Cơ', null, '20:00, 10/08/2026', 'Sân khấu & nghệ thuật', true, 'Hồ Chí Minh', 'event', 'Vở kịch kinh dị, giật gân thu hút sự chú ý của giới trẻ.', 'org_san_khau_the_gioi_tre', 'published'),
  ('e16', 'SKNT TRƯƠNG HÙNG MINH : NGÀY MAI NGƯỜI TA LẤY CHỒNG', null, '19:30, 15/08/2026', 'Sân khấu & nghệ thuật', false, 'Hồ Chí Minh', 'event', 'Câu chuyện tình cảm nhẹ nhàng, sâu lắng.', 'org_sknt_truong_hung_minh', 'published'),
  ('e17', 'Trải Nghiệm Bay Dù Lượn Hà Nội', null, '08:00 - 17:00, Cuối tuần', 'Tham quan & trải nghiệm', true, 'Hà Nội', 'event', 'Trải nghiệm ngắm nhìn toàn cảnh từ trên cao cực kỳ kích thích dành cho những người đam mê thể thao mạo hiểm.', 'org_hanoi_paragliding', 'published'),
  ('e18', 'Địa Đạo Củ Chi : Trăng Chiến Khu', null, '18:00 - 21:00, 14/06/2026', 'Tham quan & trải nghiệm', false, 'Hồ Chí Minh', 'event', 'Tour tham quan đêm độc đáo tái hiện lại đời sống sinh hoạt và chiến đấu tại Củ Chi.', 'org_khu_di_tich_cu_chi', 'published'),
  ('e19', 'Trải Nghiệm Bay Dù Lượn Mù Cang Chải', null, '07:00 - 16:00, Tháng 9/2026', 'Tham quan & trải nghiệm', true, 'Other', 'event', 'Bay dù lượn ngắm mùa lúa chín vàng ươm tại Mù Cang Chải.', 'org_mcc_paragliding', 'published'),
  ('e20', 'Vietnam Int''l Cafe Show 2026 in HCMC', null, '09:00 - 17:00, 20/07/2026', 'Tham quan & trải nghiệm', true, 'Hồ Chí Minh', 'event', 'Triển lãm chuyên ngành F&B mang đến trải nghiệm toàn diện về ngành công nghiệp cà phê và thức uống.', 'org_exporum_vietnam', 'published'),
  ('e21', 'Aquafield Ocean City', null, 'Mở cửa hàng ngày', 'Tham quan & trải nghiệm', true, 'Hà Nội', 'event', 'Tổ hợp vui chơi giải trí dưới nước mang phong cách nghỉ dưỡng hiện đại.', 'org_ocean_city', 'published'),
  ('e22', 'IMMERSIVE OPERA HOUSE - "115 NĂM NHÀ HÁT KỂ CHUYỆN"', null, '19:00, 12/08/2026', 'Sân khấu & nghệ thuật', false, 'Hồ Chí Minh', 'event', 'Show diễn thực tế ảo và nghệ thuật thị giác độc đáo kể lại lịch sử 115 năm của Nhà hát Thành phố.', 'org_saigon_opera_house', 'published'),
  ('e23', 'Vé vào cửa Công Viên Biển Hà Nội - Tuần Châu', null, '08:00 - 18:00, Mở cửa hàng ngày', 'Tham quan & trải nghiệm', false, 'Hà Nội', 'event', 'Khu vui chơi bãi biển nhân tạo lớn nhất ngoại thành Hà Nội.', 'org_tuan_chau_hn', 'published'),
  ('e24', 'Trải Nghiệm Bay Dù Lượn Mù Cang Chải (Dự kiến mở thêm)', 'https://salt.tkbcdn.com/ts/ds/da/85/17/b6ffb722910203a125c0fd062b52d242.jpeg', 'Sắp diễn ra', 'Tham quan & trải nghiệm', false, 'Other', 'event', 'Đăng ký nhận thông báo sớm cho đợt mở bán vé tiếp theo của sự kiện bay dù lượn.', 'org_mcc_paragliding', 'published')
on conflict (id) do update set
  title = excluded.title,
  image_url = excluded.image_url,
  date_display = excluded.date_display,
  category = excluded.category,
  is_trending = excluded.is_trending,
  location = excluded.location,
  type = excluded.type,
  description = excluded.description,
  organizer_id = excluded.organizer_id,
  status = excluded.status;

insert into public.event_tickets (
  id, event_id, name, price, remaining, benefits
)
values
  ('e1-1', 'e1', 'Standard', 500000, 150, '["Vào cửa tự do khu vực khán đài"]'::jsonb),
  ('e2-1', 'e2', 'Standard', 130000, 80, null),
  ('e3-1', 'e3', 'Standard', 0, 0, '["Sự kiện đã kết thúc"]'::jsonb),
  ('e4-1', 'e4', 'Standard', 0, 0, '["Sự kiện đã kết thúc"]'::jsonb),
  ('e5-1', 'e5', 'Standard', 0, 0, '["Sự kiện đã kết thúc"]'::jsonb),
  ('e6-1', 'e6', 'Standard', 249000, 0, null),
  ('e7-1', 'e7', 'Standard', 200000, 45, null),
  ('e7-2', 'e7', 'Courtside', 800000, 5, '["Chỗ ngồi sát sân","Tặng áo thun"]'::jsonb),
  ('e8-1', 'e8', 'Standard', 150000, 120, null),
  ('e9-1', 'e9', 'Standard', 350000, 20, null),
  ('e9-2', 'e9', 'VIP', 450000, 0, '["Hàng ghế trung tâm"]'::jsonb),
  ('e10-1', 'e10', 'Standard', 330000, 40, null),
  ('e11-1', 'e11', 'Standard', 300000, 12, null),
  ('e12-1', 'e12', 'Standard', 300000, 25, null),
  ('e13-1', 'e13', 'Standard', 330000, 30, null),
  ('e14-1', 'e14', 'Standard', 350000, 50, null),
  ('e15-1', 'e15', 'Standard', 350000, 15, null),
  ('e16-1', 'e16', 'Standard', 300000, 60, null),
  ('e17-1', 'e17', 'Chuyến bay tiêu chuẩn', 1850000, 15, '["Bao gồm quay video GoPro"]'::jsonb),
  ('e18-1', 'e18', 'Vé người lớn', 399000, 50, null),
  ('e19-1', 'e19', 'Vé bay', 2190000, 30, null),
  ('e20-1', 'e20', 'Vé tham quan', 150000, 500, '["Tham quan các gian hàng","Dùng thử sản phẩm"]'::jsonb),
  ('e21-1', 'e21', 'Vé vào cổng', 170000, 500, null),
  ('e22-1', 'e22', 'Standard', 300000, 100, null),
  ('e23-1', 'e23', 'Standard', 150000, 200, null),
  ('e24-1', 'e24', 'Chờ mở bán', 0, 0, null)
on conflict (id) do update set
  event_id = excluded.event_id,
  name = excluded.name,
  price = excluded.price,
  remaining = excluded.remaining,
  benefits = excluded.benefits;

commit;
